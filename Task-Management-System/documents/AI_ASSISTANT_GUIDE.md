# AI Assistant - Hướng dẫn sử dụng

## Thiết lập

### 1. Lấy Gemini API Key

1. Truy cập [Google AI Studio](https://aistudio.google.com/)
2. Đăng nhập với tài khoản Google
3. Nhấn "Get API Key"
4. Tạo API key mới cho dự án
5. Sao chép API key

### 2. Thêm vào file `.env.local`

Tạo file `.env.local` trong thư mục gốc dự án:

```
VITE_GEMINI_API_KEY=your_api_key_here
```

Thay `your_api_key_here` bằng API key từ bước 1.

### 3. Khởi động ứng dụng

```bash
npm run dev
```

## Chức năng AI

### 📋 Lời khuyên hôm nay
- Nhấp "📋 Lời khuyên hôm nay"
- AI sẽ phân tích các task hiện tại
- Cung cấp 2-3 lời khuyên cải thiện năng suất
- **Kết quả được lưu cache 1 giờ**

### ➕ Phân tích Task
1. Nhấp "➕ Phân tích Task"
2. Mô tả task của bạn tự nhiên
3. Nhấp "Phân tích"
4. AI sẽ gợi ý:
   - Độ ưu tiên (Cao/Trung bình/Thấp)
   - 4-5 sub-tasks hợp lý

## Hạn chế sử dụng

- **20 yêu cầu/ngày** (giới hạn bảo toàn)
- **10 giây tối thiểu** giữa các yêu cầu
- **1 giờ cache** - kết quả được lưu 1 giờ
- **Yêu cầu tuần tự** - tự động xếp hàng đợi (không gửi đồng thời)
- **Không quá tải** - đợi nếu cần thiết

## Xem mức sử dụng

Mức sử dụng hiển thị ở góc phải của AI Assistant:
```
Sử dụng: 12/30
```

Khi vượt quá 30, tất cả tính năng AI sẽ tắt cho đến ngày mai.

## Ghi chú

- Lần đầu tiên sử dụng có thể mất 2-3 giây
- Lần thứ hai (nếu cache) tức thì
- Không có yêu cầu tự động, do người dùng kiểm soát
- Tiết kiệm giới hạn nhờ caching và rate limiting tông minh

## Troubleshooting

**Lỗi: "Invalid API key"**
- Kiểm tra API key trong `.env.local`
- Đảm bảo tệp đặt ở thư mục gốc dự án
- Khởi động lại dev server

**Lỗi: "Đã vượt quá giới hạn hàng ngày"**
- Đã sử dụng 30 yêu cầu hôm nay
- Vui lòng thử lại vào ngày mai

**Chậm lần đầu**
- Bình thường, Gemini API cần 1-2 giây
- Lần tiếp theo sẽ nhanh hơn nếu sử dụng cache
