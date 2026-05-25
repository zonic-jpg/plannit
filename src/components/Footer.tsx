export default function Footer() {
  return (
    <footer className="border-t border-zinc-100 py-8 mt-auto">
      <p className="text-center text-sm text-muted">
        &copy; {new Date().getFullYear()} RUBBA. Plan your life, your way.
      </p>
    </footer>
  );
}
