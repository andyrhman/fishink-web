import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
    AlertTriangle,
    ShieldCheck,
    Globe,
    Server,
    CalendarClock,
    Link2,
    Image,
    LoaderCircle,
    Cpu,
    Workflow,
} from "lucide-react";

const API_BASE = "http://localhost:8000/api";

async function postJson(endpoint, url) {
    const response = await fetch(`${API_BASE}/${endpoint}/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
    });

    let payload = null;
    try {
        payload = await response.json();
    } catch {
        throw new Error("Gagal membaca respons server.");
    }

    if (!response.ok || payload?.success === false) {
        throw new Error(payload?.error || "Gagal mengambil data URL.");
    }

    return payload.data;
}

export default function ResultPage({ theme, toggleTheme }) {
    const location = useLocation();
    const navigate = useNavigate();
    const rawUrl = location.state?.url || "";

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showAllCertificates, setShowAllCertificates] = useState(false);
    const [result, setResult] = useState(null);

    useEffect(() => {
        if (!rawUrl) {
            navigate("/", { replace: true });
            return;
        }

        let ignore = false;

        const loadAllData = async () => {
            setLoading(true);
            setError("");

            try {
                const [phishing, insight, certificateHistory, screenshot] = await Promise.all([
                    postJson("phishing-check", rawUrl),
                    postJson("insight", rawUrl),
                    postJson("certificate-history", rawUrl),
                    postJson("screenshot", rawUrl),
                ]);

                if (ignore) return;

                setResult({
                    phishing,
                    insight,
                    certificateHistory,
                    screenshot,
                });
            } catch (err) {
                if (ignore) return;

                const message = err?.message || "URL tidak dapat diproses.";
                const friendlyMessage = /ERR_NAME_NOT_RESOLVED|not resolve|invalid/i.test(message)
                    ? "Bukan URL Valid"
                    : message;

                setError(friendlyMessage);
                window.alert(friendlyMessage);
            } finally {
                if (!ignore) setLoading(false);
            }
        };

        loadAllData();

        return () => {
            ignore = true;
        };
    }, [rawUrl, navigate]);

    const phishingData = result?.phishing;
    const insightData = result?.insight;
    const certData = result?.certificateHistory;
    const screenshotData = result?.screenshot;

    const probabilityPercent = useMemo(() => {
        if (!phishingData) return 0;
        if (typeof phishingData.estimated_phishing_score === "number") {
            return phishingData.estimated_phishing_score;
        }
        if (typeof phishingData.probability === "number") {
            return Math.round(phishingData.probability * 100);
        }
        return 0;
    }, [phishingData]);

    const isPhishing = phishingData?.prediction === "PHISHING";
    const resultBadgeClass = isPhishing ? "badge badge-error" : "badge badge-success";
    const alertClass = isPhishing ? "alert alert-error" : "alert alert-success";

    if (loading) {
        return (
            <div className="drawer lg:drawer-open">
                <input id="fishink-drawer" type="checkbox" className="drawer-toggle" />

                <div className="drawer-content flex min-h-screen flex-col bg-base-100 text-base-content">
                    <Navbar theme={theme} toggleTheme={toggleTheme} />

                    <main className="flex flex-1 items-center justify-center px-4">
                        <div className="w-full max-w-xl text-center">
                            <div className="flex justify-center">
                                <span className="loading loading-spinner loading-lg text-primary" />
                            </div>
                            <h1 className="mt-6 text-3xl font-bold sm:text-4xl">
                                Mengecek URL...
                            </h1>
                            <p className="mt-3 text-base-content/60">
                                Mohon tunggu, kami sedang mengambil hasil phishing, insight, sertifikat, dan screenshot.
                            </p>
                            <progress className="progress progress-primary mt-8 w-full" />
                            <div className="mt-6 text-sm text-base-content/50">
                                Proses ini bisa memakan waktu beberapa detik.
                            </div>
                        </div>
                    </main>

                    <Footer />
                </div>
            </div>
        );
    }

    return (
        <div className="drawer lg:drawer-open">
            <input id="fishink-drawer" type="checkbox" className="drawer-toggle" />

            <div className="drawer-content flex min-h-screen flex-col bg-base-100 text-base-content">
                <Navbar theme={theme} toggleTheme={toggleTheme} />

                <main className="flex-1">
                    <section className="w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
                        <div className="w-full space-y-6">
                            {error ? (
                                <div className="alert alert-error">
                                    <AlertTriangle className="h-5 w-5" />
                                    <span>{error}</span>
                                </div>
                            ) : (
                                <div className={alertClass}>
                                    {isPhishing ? (
                                        <AlertTriangle className="h-5 w-5" />
                                    ) : (
                                        <ShieldCheck className="h-5 w-5" />
                                    )}
                                    <span>
                                        {isPhishing
                                            ? "URL ini terindikasi phishing."
                                            : "URL ini terdeteksi terpercaya."}
                                    </span>
                                </div>
                            )}

                            {!error && (
                                <>
                                    <div className="rounded-box border border-base-200 bg-base-100 p-6 shadow-sm">
                                        <div className="text-center">
                                            <p className="text-sm font-medium text-base-content/60">
                                                Kemungkinan Phishing
                                            </p>

                                            <div className="mt-4 flex justify-center">
                                                <div
                                                    className={`radial-progress ${isPhishing ? "text-error" : "text-success"
                                                        } border-2 border-base-300 bg-base-100`}
                                                    style={{
                                                        "--value": probabilityPercent,
                                                        "--size": "11rem",
                                                        "--thickness": "12px",
                                                    }}
                                                    role="progressbar"
                                                >
                                                    <span className="text-2xl font-bold">
                                                        {probabilityPercent}%
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="mt-5 flex justify-center">
                                                <span className={resultBadgeClass}>
                                                    {isPhishing ? "Phishing" : "Terpercaya"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid gap-6 xl:grid-cols-[1.05fr_1.55fr]">
                                        <div className="card border border-base-200 bg-base-100 shadow-sm">
                                            <div className="card-body">
                                                <h2 className="card-title text-xl">Hasil Scan</h2>

                                                <div className="mt-4 space-y-4 text-sm">
                                                    <div>
                                                        <p className="font-medium text-base-content/60">Sumber URL</p>
                                                        <p className="mt-1 break-all">{phishingData?.url || rawUrl}</p>
                                                    </div>

                                                    <div>
                                                        <p className="font-medium text-base-content/60">Normalisasi URL</p>
                                                        <p className="mt-1 break-all">
                                                            {phishingData?.masked_url || insightData?.normalized_url || rawUrl}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="font-medium text-base-content/60">Location</p>
                                                        <p className="mt-1">{insightData?.location || "-"}</p>
                                                    </div>

                                                    <div>
                                                        <p className="font-medium text-base-content/60">IP Address</p>
                                                        <p className="mt-1">{insightData?.ip_address || "-"}</p>
                                                    </div>

                                                    <div>
                                                        <p className="font-medium text-base-content/60">Top level domain</p>
                                                        <p className="mt-1">{insightData?.top_level_domain || "-"}</p>
                                                    </div>

                                                    <div>
                                                        <p className="font-medium text-base-content/60">Tanggal deteksi</p>
                                                        <p className="mt-1">{insightData?.detection_date || "-"}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="card border border-base-200 bg-base-100 shadow-sm">
                                            <div className="card-body">
                                                <h2 className="card-title text-xl">Screenshot</h2>

                                                <div className="mt-4 overflow-hidden rounded-box border border-dashed border-base-300 bg-base-200/30">
                                                    <div className="min-h-[24rem] sm:min-h-[32rem] lg:min-h-[44rem]">
                                                        {screenshotData?.screenshot_url ? (
                                                            <img
                                                                src={screenshotData.screenshot_url}
                                                                alt="Website screenshot"
                                                                className="h-full w-full object-contain object-top"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full min-h-[24rem] items-center justify-center p-8 text-center text-base-content/50 sm:min-h-[32rem] lg:min-h-[44rem]">
                                                                <div>
                                                                    <Image className="mx-auto h-10 w-10" />
                                                                    <p className="mt-3">Pratinjau screenshot akan muncul di sini.</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-3">
                                        <div className="rounded-box border border-base-200 bg-base-100 p-4">
                                            <div className="flex items-center gap-2">
                                                <Link2 className="h-4 w-4 text-primary" />
                                                <span className="font-medium">URL</span>
                                            </div>
                                            <p className="mt-2 break-all text-sm text-base-content/70">
                                                {phishingData?.url || rawUrl}
                                            </p>
                                        </div>

                                        <div className="rounded-box border border-base-200 bg-base-100 p-4">
                                            <div className="flex items-center gap-2">
                                                <Globe className="h-4 w-4 text-primary" />
                                                <span className="font-medium">Lokasi Server</span>
                                            </div>
                                            <p className="mt-2 text-sm text-base-content/70">
                                                {insightData?.location || "-"}
                                            </p>
                                        </div>

                                        <div className="rounded-box border border-base-200 bg-base-100 p-4">
                                            <div className="flex items-center gap-2">
                                                <Server className="h-4 w-4 text-primary" />
                                                <span className="font-medium">Hosting/IP</span>
                                            </div>
                                            <p className="mt-2 text-sm text-base-content/70">
                                                {insightData?.hosting_provider || insightData?.ip_address || "-"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="card border border-base-200 bg-base-100 shadow-sm">
                                        <div className="card-body">
                                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                                <h2 className="card-title text-xl">Riwayat Sertifikat</h2>
                                                <p className="text-sm text-base-content/50">
                                                    Tampilkan satu sertifikat terlebih dahulu, lalu perluas jika perlu.
                                                </p>
                                            </div>

                                            <div className="mt-4 space-y-4">
                                                {(showAllCertificates ? certData?.certificate_history || [] : (certData?.certificate_history || []).slice(0, 1)).map((cert, index) => (
                                                    <div
                                                        key={cert.crtsh_id || index}
                                                        className="rounded-box border border-base-200 bg-base-100 p-4"
                                                    >
                                                        <div className="flex items-center justify-between gap-3">
                                                            <div className="flex items-center gap-2">
                                                                <CalendarClock className="h-4 w-4 text-primary" />
                                                                <span className="font-medium">
                                                                    Sertifikat {showAllCertificates ? index + 1 : 1}
                                                                </span>
                                                            </div>
                                                            <span className="badge badge-outline">crt.sh</span>
                                                        </div>

                                                        <div className="mt-3 grid gap-3 text-sm md:grid-cols-2">
                                                            <div>
                                                                <p className="font-medium text-base-content/60">Issuer</p>
                                                                <p className="mt-1 break-all">{cert.issuer_name}</p>
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-base-content/60">Common Name</p>
                                                                <p className="mt-1 break-all">{cert.common_name}</p>
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-base-content/60">Nama Domain</p>
                                                                <p className="mt-1 whitespace-pre-line break-all">{cert.name_value}</p>
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-base-content/60">Waktu Entri</p>
                                                                <p className="mt-1 break-all">{cert.entry_timestamp}</p>
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-base-content/60">Not Before</p>
                                                                <p className="mt-1 break-all">{cert.not_before}</p>
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-base-content/60">Not After</p>
                                                                <p className="mt-1 break-all">{cert.not_after}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {(certData?.certificate_history || []).length > 1 && (
                                                <div className="mt-4 flex justify-center">
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline btn-sm"
                                                        onClick={() => setShowAllCertificates((prev) => !prev)}
                                                    >
                                                        {showAllCertificates ? "Sembunyikan sertifikat" : "Lihat semua sertifikat"}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </section>
                </main>

                <Footer />
            </div>
        </div>
    );
}