import './globals.css';

export const metadata = {
  title: 'IROX — Industrial Robotics Integration',
  description: 'Роботизация производственных операций под ключ: PALLET, WELD, MOVE, VISION.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
