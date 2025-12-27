/**
 * Gemini AI Service
 * Purpose: Handle communication with Google Gemini AI API
 * This service processes user queries and generates intelligent responses
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../../.env') });

class GeminiService {
    constructor() {
        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your-gemini-api-key-here') {
            console.warn('⚠️  WARNING: GEMINI_API_KEY not configured properly!');
            console.warn('Get your free API key at: https://aistudio.google.com/app/apikey');
            this.genAI = null;
        } else {
            this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        }
        
        // Use Gemini 2.5 Flash - newest and fastest model
        this.model = this.genAI ? this.genAI.getGenerativeModel({ model: 'models/gemini-2.5-flash' }) : null;
    }

    /**
     * Extract product search criteria from user's natural language query
     * Example input: "Tôi muốn tìm váy dự tiệc màu xanh giá dưới 1 triệu"
     * Example output: { category: 'váy', occasion: 'dự tiệc', color: 'xanh', maxPrice: 1000000 }
     */
    async extractSearchCriteria(userQuery) {
        try {
            if (!this.model) {
                throw new Error('Gemini API not configured');
            }

            const prompt = `
Bạn là một trợ lý mua sắm thông minh. Phân tích yêu cầu của khách hàng và trích xuất thông tin tìm kiếm. Phải tìm kiếm thật chặt chẽ với yêu cầu của người dùng dựa trên category không tìm kiếm sản phẩm khác với category người dùng đã nêu.

YÊU CẦU KHÁCH HÀNG: "${userQuery}"

Hãy trích xuất các thông tin sau (nếu có). QUAN TRỌNG: Tất cả từ khóa phải bằng TIẾNG ANH:
- category: Loại sản phẩm bằng tiếng Anh (phone, laptop, headphones, watch, tablet, camera, etc.)
- keywords: Từ khóa mô tả bằng tiếng Anh (smartphone, wireless, gaming, professional, budget, premium, etc.)
- color: Màu sắc bằng tiếng Anh (black, white, blue, red, silver, etc.)
- minPrice: Giá tối thiểu (số tiền VNĐ)
- maxPrice: Giá tối đa (số tiền VNĐ)
- brand: Thương hiệu nếu có (Apple, Samsung, Sony, Dell, etc.)

Dịch từ tiếng Việt sang tiếng Anh:
- điện thoại/smartphone → phone, smartphone, mobile
- laptop/máy tính → laptop, computer, notebook
- tai nghe → headphones, earphones, earbuds
- đồng hồ → watch, smartwatch
- máy ảnh → camera
- iPhone → Apple, iPhone (brand: Apple)
- Samsung → Samsung (brand: Samsung)

QUAN TRỌNG: Trả về ĐÚNG định dạng JSON sau, không thêm text khác:
{
    "category": "string in English or null",
    "keywords": ["array", "of", "english", "keywords"],
    "color": "string in English or null",
    "minPrice": number or null,
    "maxPrice": number or null,
    "brand": "string or null"
}

Ví dụ 1: "Tôi muốn tìm điện thoại Samsung giá dưới 20 triệu"
(20,000,000 VND tương đương khoảng 800 USD)
→ {"category":"phone","keywords":["smartphone","mobile","android"],"color":null,"minPrice":null,"maxPrice":800,"brand":"Samsung"}

Ví dụ 2: "Laptop gaming màu đen giá từ 15-25 triệu"
(Khoảng giá 15,000,000 - 25,000,000 VND tương đương khoảng 600 - 1000 USD)
→ {"category":"laptop","keywords":["gaming","computer","performance"],"color":"black","minPrice":600,"maxPrice":1000,"brand":null}

Ví dụ 3: "Tai nghe không dây Apple"
→ {"category":"headphones","keywords":["wireless","earbuds","bluetooth"],"color":null,"minPrice":null,"maxPrice":null,"brand":"Apple"}
`;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Extract JSON from response
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('Failed to extract JSON from AI response');
            }

            const criteria = JSON.parse(jsonMatch[0]);
            return criteria;

        } catch (error) {
            console.error('Error extracting search criteria:', error);
            throw new Error(`Failed to process query: ${error.message}`);
        }
    }

    /**
     * Generate explanation for why products were recommended
     * This helps users understand AI's reasoning
     */
    async generateProductExplanation(userQuery, products, searchCriteria) {
        try {
            if (!this.model) {
                throw new Error('Gemini API not configured');
            }

            const prompt = `
Bạn là trợ lý mua sắm chuyên nghiệp. Giải thích tại sao bạn đề xuất các sản phẩm này cho khách hàng.

YÊU CẦU: "${userQuery}"

TIÊU CHÍ TÌM KIẾM:
${JSON.stringify(searchCriteria, null, 2)}

SẢN PHẨM ĐỀ XUẤT:
${JSON.stringify(products.map(p => ({
    name: p.name,
    price: p.price,
    description: p.description
})), null, 2)}

Hãy viết một đoạn văn ngắn (2-3 câu) giải thích:
1. Tại sao các sản phẩm này phù hợp với yêu cầu
2. Điểm nổi bật của từng sản phẩm
3. Lời khuyên để khách hàng lựa chọn

Giữ giọng văn thân thiện, chuyên nghiệp. Không dùng markdown.
`;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text().trim();

        } catch (error) {
            console.error('Error generating explanation:', error);
            return 'Tôi đã tìm thấy một số sản phẩm phù hợp với yêu cầu của bạn. Hãy xem qua và cho tôi biết nếu bạn cần thêm thông tin!';
        }
    }

    /**
     * Generate a friendly greeting message for new chat sessions
     */
    async generateGreeting() {
        const greetings = [
            'Xin chào! 👋 Tôi là trợ lý mua sắm AI. Hãy cho tôi biết bạn đang tìm kiếm gì nhé!',
            'Chào bạn! 🛍️ Tôi sẵn sàng giúp bạn tìm sản phẩm hoàn hảo. Bạn muốn mua gì hôm nay?',
            'Hi! ✨ Tôi có thể giúp bạn tìm sản phẩm phù hợp. Hãy mô tả những gì bạn cần!',
            'Chào mừng! 🎉 Hãy cho tôi biết bạn đang tìm loại sản phẩm nào nhé!'
        ];
        
        return greetings[Math.floor(Math.random() * greetings.length)];
    }

    /**
     * Handle follow-up questions and context-aware responses
     */
    async generateFollowUpResponse(userQuery, chatHistory) {
        try {
            if (!this.model) {
                throw new Error('Gemini API not configured');
            }

            const prompt = `
Bạn là trợ lý mua sắm. Khách hàng đang hỏi thêm về các sản phẩm đã gợi ý.

LỊCH SỬ CHAT:
${chatHistory.map(msg => `${msg.role === 'user' ? 'Khách hàng' : 'Bạn'}: ${msg.content}`).join('\n')}

CÂU HỎI MỚI: "${userQuery}"

Trả lời ngắn gọn, hữu ích. Nếu khách hàng muốn lọc thêm, đề nghị họ cung cấp thêm chi tiết.
Không dùng markdown.
`;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text().trim();

        } catch (error) {
            console.error('Error generating follow-up response:', error);
            return 'Xin lỗi, tôi không hiểu câu hỏi của bạn. Bạn có thể nói rõ hơn được không?';
        }
    }
}

module.exports = new GeminiService();
