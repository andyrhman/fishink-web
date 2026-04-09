import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
    ArrowRight,
    ScanLine,
    ShieldCheck,
    Globe,
    Bot,
    Fingerprint,
    Link2,
    Workflow,
    Cpu,
} from "lucide-react";

function normalizeUrl(input) {
    let url = input.trim();
    if (!/^https?:\/\//i.test(url)) {
        url = `https://${url}`;
    }
    return url;
}

function isValidUrl(input) {
    try {
        const url = new URL(normalizeUrl(input));
        return ["http:", "https:"].includes(url.protocol) && Boolean(url.hostname);
    } catch {
        return false;
    }
}

export default function HomePage({ theme, toggleTheme }) {
    const navigate = useNavigate();
    const [url, setUrl] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!isValidUrl(url)) {
            window.alert("Bukan URL Valid");
            return;
        }

        const normalizedUrl = normalizeUrl(url);
        navigate("/result", { state: { url: normalizedUrl } });
    };

    const handleClear = () => setUrl("");
    return (
        <div className="drawer lg:drawer-open">
            <input id="fishink-drawer" type="checkbox" className="drawer-toggle" />

            <div className="drawer-content flex min-h-screen flex-col bg-base-100 text-base-content">
                <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap');`}</style>

                <Navbar theme={theme} toggleTheme={toggleTheme} />

                <main className="flex-1">
                    <section className="relative overflow-hidden">
                        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/10 via-base-100 to-base-100" />
                        <div className="absolute left-1/2 top-10 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

                        <div className="container mx-auto px-4 py-10 sm:py-14 lg:py-20">
                            <div className="mx-auto max-w-6xl text-center">
                                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                                    <Fingerprint className="h-4 w-4" />
                                    Deteksi phishing URL dan intelijen website
                                </div>

                                <h1
                                    className="mx-auto mt-6 max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
                                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                                >
                                    Periksa tautan mencurigakan dengan dashboard keamanan yang rapi.
                                </h1>

                                <p className="mx-auto mt-5 max-w-2xl text-base text-base-content/70 sm:text-lg">
                                    Fishink menyediakan halaman utama yang bersih untuk mengecek URL, melihat detail website, dan menyiapkan alur keamanan ke depannya.
                                </p>

                                <div id="check-url" className="mx-auto mt-10 max-w-3xl">
                                    <div className="card border border-base-200 bg-base-100 shadow-xl">
                                        <div className="card-body p-5 sm:p-8">
                                            <div className="flex items-center gap-2 text-sm font-semibold text-base-content/60">
                                                <ScanLine className="h-4 w-4" />
                                                Pemindai URL
                                            </div>

                                            <h2 className="card-title mt-1 text-2xl sm:text-3xl">
                                                Masukkan tautan website
                                            </h2>
                                            <p className="text-left text-sm text-base-content/60 sm:text-base">
                                                Untuk saat ini baru tampilan frontend. Integrasi API akan disambungkan nanti.
                                            </p>

                                            <form className="mt-6 space-y-4 text-left" onSubmit={handleSubmit}>
                                                <label className="form-control w-full">
                                                    <div className="label">
                                                        <span className="label-text font-medium">URL Website</span>
                                                    </div>
                                                    <div className="join w-full">
                                                        <span className="join-item btn btn-outline pointer-events-none hidden sm:inline-flex">
                                                            <Link2 className="h-4 w-4" />
                                                        </span>
                                                        <input
                                                            type="text"
                                                            placeholder="https://example.com"
                                                            className="input input-bordered join-item w-full"
                                                            value={url}
                                                            onChange={(e) => setUrl(e.target.value)}
                                                            onKeyDown={(e) => {
                                                                if (e.key === "Enter") {
                                                                    handleSubmit(e);
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="label">
                                                        <span className="label-text-alt text-base-content/45">
                                                            Contoh: https://fogu.com/hm/hmawl/events.php
                                                        </span>
                                                    </div>
                                                </label>

                                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                    <button
                                                        type="button"
                                                        className="btn btn-ghost btn-sm sm:btn-md"
                                                        onClick={handleClear}
                                                    >
                                                        Bersihkan
                                                    </button>

                                                    <button type="submit" className="btn btn-primary btn-sm sm:btn-md">
                                                        Periksa URL
                                                        <ArrowRight className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div id="features" className="mx-auto mt-14 grid max-w-6xl gap-4 md:grid-cols-3">
                                <div className="card border border-base-200 bg-base-100 shadow-sm transition hover:shadow-md">
                                    <div className="card-body p-6">
                                        <ShieldCheck className="h-9 w-9 text-primary" />
                                        <h3 className="card-title mt-2 text-lg">Pemeriksaan phishing</h3>
                                        <p className="text-sm text-base-content/65">
                                            Titik masuk sederhana untuk memeriksa risiko URL dan indikator kepercayaan.
                                        </p>
                                    </div>
                                </div>

                                <div className="card border border-base-200 bg-base-100 shadow-sm transition hover:shadow-md">
                                    <div className="card-body p-6">
                                        <Globe className="h-9 w-9 text-primary" />
                                        <h3 className="card-title mt-2 text-lg">Insight website</h3>
                                        <p className="text-sm text-base-content/65">
                                            Siap menampilkan metadata seperti IP, hosting, sertifikat, dan tangkapan layar.
                                        </p>
                                    </div>
                                </div>

                                <div className="card border border-base-200 bg-base-100 shadow-sm transition hover:shadow-md">
                                    <div className="card-body p-6">
                                        <Bot className="h-9 w-9 text-primary" />
                                        <h3 className="card-title mt-2 text-lg">Alur UI modern</h3>
                                        <p className="text-sm text-base-content/65">
                                            Tata letak responsif yang dibuat dengan Tailwind dan DaisyUI.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <section id="how-it-works" className="mx-auto mt-16 max-w-6xl">
                                <div className="rounded-3xl border border-base-200 bg-base-100 p-6 shadow-sm sm:p-8">
                                    <div className="max-w-2xl">
                                        <h2 className="text-2xl font-bold sm:text-3xl">Begini alur kerjanya nanti</h2>
                                        <p className="mt-2 text-base-content/60">
                                            Ini adalah halaman utama yang fokus ke frontend terlebih dahulu. Panel analisis bisa disambungkan setelah tampilan disetujui.
                                        </p>
                                    </div>

                                    <div className="mt-6 grid gap-4 md:grid-cols-3">
                                        {[
                                            ["1", "Tempel URL", "Pengguna memasukkan alamat website pada form utama."],
                                            ["2", "Backend memproses", "Server menerima URL, mengekstrak fitur, menjalankan model ML, lalu mengembalikan hasil phishing."],
                                            ["3", "Tampilkan hasil", "Dashboard menampilkan risiko, metadata, dan pratinjau visual secara ringkas."],
                                        ].map(([step, title, text]) => (
                                            <div key={step} className="rounded-2xl bg-base-200/50 p-5">
                                                <div className="flex items-center gap-2">
                                                    <div className="badge badge-primary">Langkah {step}</div>
                                                    {step === "2" ? (
                                                        <Cpu className="h-4 w-4 text-primary" />
                                                    ) : (
                                                        <Workflow className="h-4 w-4 text-primary" />
                                                    )}
                                                </div>
                                                <h3 className="mt-3 font-semibold">{title}</h3>
                                                <p className="mt-2 text-sm text-base-content/65">{text}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        </div>
                    </section>
                </main>

                <Footer />
            </div>

            <div className="drawer-side z-50 lg:hidden">
                <label htmlFor="fishink-drawer" aria-label="close sidebar" className="drawer-overlay" />
                <ul className="menu min-h-full w-80 bg-base-100 p-4 text-base-content shadow-xl">
                    <li className="mb-2">
                        <a href="/" className="text-lg font-bold">
                            <span style={{ fontFamily: "'Space Grotesk', sans-serif" }} className="text-primary">
                                Fishink
                            </span>
                        </a>
                    </li>
                    <li><a href="#features">Fitur</a></li>
                    <li><a href="#check-url">Cek URL</a></li>
                    <li><a href="#how-it-works">Cara kerja</a></li>
                    <li className="mt-4">
                        <a
                            href="https://github.com/andyrhman/fishink-web.git"
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-primary btn-block gap-2"
                        >
                            GitHub
                        </a>
                    </li>
                    <li className="mt-3">
                        <button type="button" onClick={toggleTheme} className="btn btn-ghost btn-block gap-2">
                            {theme === "light" ? "Gelap" : "Terang"}
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
}