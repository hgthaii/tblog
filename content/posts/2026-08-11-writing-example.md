---
title: "Một bài viết nên được trình bày thế nào"
createdAt: "11/08/2026"
authorName: "thái."
category: "ghi chú, markdown"
---

Một bài viết ở đây không cần quá dài, nhưng nên đủ rõ để vài tháng sau đọc lại vẫn hiểu mình đã nghĩ gì, làm gì và rút ra điều gì.

## 1. Mở bài ngắn, đi thẳng vào vấn đề

Chỉ cần hai hoặc ba đoạn đầu để trả lời ba câu hỏi:

- Bài này nói về chuyện gì.
- Vì sao mình viết nó lúc này.
- Người đọc nên kỳ vọng điều gì ở phần còn lại.

Nếu có một câu đủ cô đọng để giữ nhịp cho cả bài, hãy đặt nó ở đầu:

> Viết để nhớ lại cách mình đã đi qua một vấn đề, không phải để làm nó trông to tát hơn.

## 2. Phần thân nên có nhịp

Một bài kỹ thuật thường dễ đọc hơn khi tách thành các phần ngắn, mỗi phần chỉ giữ một ý chính. Thay vì dồn tất cả vào một đoạn dài, nên chia theo mạch như sau:

1. Bối cảnh ban đầu.
2. Điều gì đã không ổn.
3. Cách mình xử lý.
4. Điều đáng giữ lại cho lần sau.

Ví dụ, nếu đang ghi lại một lần sửa lỗi deploy, phần diễn đạt có thể gọn như sau:

```bash
pnpm install
pnpm build
```

Đủ để người khác hoặc chính mình sau này biết bước kiểm tra cơ bản đã bắt đầu từ đâu.

## 3. Chỉ thêm list khi nó làm bài rõ hơn

List hợp khi cần gom ý nhanh, checklist hoặc những điều cần nhớ. Không cần biến mọi đoạn văn thành bullet.

- Dùng list cho việc có thứ tự hoặc có nhóm rõ ràng.
- Dùng đoạn văn cho phần giải thích, cảm nhận hoặc kết nối ý.
- Dùng `inline code` cho tên file, command, endpoint hoặc biến.

Ví dụ:

- File bài viết nằm trong `content/posts/`.
- Slug sẽ lấy từ tên file markdown.
- Endpoint sẽ gọn hơn nếu tên file ngắn và rõ.

## 4. Link và trích dẫn nên có lý do

Nếu nhắc tới một nơi khác, hãy gắn link đúng chỗ và chỉ khi nó có giá trị. Ví dụ, nếu cần nói về CV đang nhúng trong site, có thể dẫn đến [trang tiểu sử](/cv/).

Trích dẫn cũng vậy. Một đoạn ngắn là đủ, miễn nó khóa lại ý chính:

> Đủ rõ để quay lại đọc, đủ gọn để không mệt khi viết.

## 5. Kết bài nên để lại một ý

Không cần chốt kiểu quá lớn. Chỉ cần nói rõ điều còn lại sau khi viết xong bài này là gì:

- Một cách làm có thể lặp lại.
- Một lỗi đã hiểu kỹ hơn.
- Một suy nghĩ đáng giữ cho lần sau.

Nếu muốn, có thể kết bằng một đoạn ngắn như thế này:

Mình không cố viết cho thật nhiều. Mình chỉ muốn mỗi bài khi mở lại vẫn còn ích, vẫn còn đúng với thời điểm nó được ghi xuống.
