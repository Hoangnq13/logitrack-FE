import { redirect } from 'next/navigation';

export default function Home() {
  // Vì đây là ứng dụng Admin Portal nội bộ là chính
  // Tạm thời tự động redirect trang Root (/) về thẳng trang Đăng nhập
  redirect('/login');
}
