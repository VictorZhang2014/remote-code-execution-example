import './style.css';

export const metadata = {
  title: 'Safe Remote Execution Lab',
};

export default function Layout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
