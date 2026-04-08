export default function Footer() {
    return (
        <footer
            id="footer"
            className="footer footer-center border-t border-base-200 bg-base-100 px-4 py-8 text-base-content/65"
        >
            <aside>
                <p className="text-sm sm:text-base">
                    © {new Date().getFullYear()} Fishink — deteksi phishing URL dan intelijen website.
                </p>
                <p className="text-xs sm:text-sm">
                    Dibangun dengan React, Tailwind, dan DaisyUI.
                </p>
            </aside>
        </footer>
    );
}