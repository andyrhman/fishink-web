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
    ImageOff,
    LoaderCircle,
    Cpu,
    Workflow,
} from "lucide-react";
import { getCountryCodeFromLocation, formatTanggalIndonesia } from "../helper/locale.jsx";
import ReactCountryFlag from "react-country-flag";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";

countries.registerLocale(enLocale);

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

function SkeletonLine({ className = "h-4 w-full" }) {
    return <div className={`skeleton ${className}`} />;
}

export default function ResultPage({ theme, toggleTheme }) {
    const location = useLocation();
    const navigate = useNavigate();
    const rawUrl = location.state?.url || "";

    const [loading, setLoading] = useState({
        phishing: true,
        insight: true,
        certificate: true,
        screenshot: true,
    });
    const [error, setError] = useState("");
    const [invalidUrl, setInvalidUrl] = useState(false);
    const [showAllCertificates, setShowAllCertificates] = useState(false);

    const [phishingData, setPhishingData] = useState(null);
    const [insightData, setInsightData] = useState(null);
    const [certificateData, setCertificateData] = useState(null);
    const [screenshotData, setScreenshotData] = useState(null);

    useEffect(() => {
        if (!rawUrl) {
            navigate("/", { replace: true });
            return;
        }

        let ignore = false;

        const markDone = (key) => {
            setLoading((prev) => ({ ...prev, [key]: false }));
        };

        const loadAllData = async () => {
            setError("");
            setInvalidUrl(false);

            const requests = {
                phishing: postJson("phishing-check", rawUrl),
                insight: postJson("insight", rawUrl),
                certificate: postJson("certificate-history", rawUrl),
                screenshot: postJson("screenshot", rawUrl),
            };

            for (const key of Object.keys(requests)) {
                requests[key]
                    .then((data) => {
                        if (ignore) return;

                        if (key === "phishing") setPhishingData(data);
                        if (key === "insight") setInsightData(data);
                        if (key === "certificate") setCertificateData(data);
                        if (key === "screenshot") setScreenshotData(data);
                    })
                    .catch((err) => {
                        if (ignore) return;

                        const message = err?.message || "Terjadi kesalahan.";

                        if (key === "insight") {
                            const isResolveError =
                                /ERR_NAME_NOT_RESOLVED|ENOTFOUND|not resolve|invalid/i.test(message);
                            if (isResolveError) {
                                setInvalidUrl(true);
                            } else {
                                setError(message);
                            }
                        } else if (key === "screenshot") {
                            setScreenshotData(null);
                        } else if (key === "certificate") {
                            setCertificateData(null);
                        } else if (key === "phishing") {
                            setError(message);
                        }
                    })
                    .finally(() => {
                        if (!ignore) markDone(key);
                    });
            }
        };

        loadAllData();

        return () => {
            ignore = true;
        };
    }, [rawUrl, navigate]);

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
    const alertClass = isPhishing ? "alert alert-soft alert-error" : "alert alert-soft alert-success";

    const certList = certificateData?.certificate_history || [];
    const visibleCertificates = showAllCertificates ? certList : certList.slice(0, 1);

    const allLoading =
        loading.phishing || loading.insight || loading.certificate || loading.screenshot;

    const countryCode = getCountryCodeFromLocation(insightData?.location);
    return (
        <div className="drawer lg:drawer-open">
            <input id="fishink-drawer" type="checkbox" className="drawer-toggle" />

            <div className="drawer-content flex min-h-screen flex-col bg-base-100 text-base-content">
                <Navbar theme={theme} toggleTheme={toggleTheme} />

                <main className="flex-1">
                    <section className="w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
                        <div className="w-full space-y-6">
                            {allLoading ? (
                                <div className="flex items-center justify-center rounded-box border border-base-200 bg-base-100 p-5 shadow-xl">
                                    <div className="flex items-center gap-3">
                                        <LoaderCircle className="h-5 w-5 animate-spin text-primary" />
                                        <span className="font-medium">Mengecek URL...</span>
                                    </div>
                                </div>
                            ) : error ? (
                                <div className="alert alert-soft alert-error">
                                    <AlertTriangle className="h-5 w-5" />
                                    <span className="font-semibold">{error}</span>
                                </div>
                            ) : invalidUrl ? (
                                <div className="alert alert-soft alert-warning">
                                    <AlertTriangle className="h-5 w-5" />
                                    <span className="font-semibold">Bukan URL Valid</span>
                                </div>
                            ) : (
                                <div className={alertClass}>
                                    {isPhishing ? (
                                        <AlertTriangle className="h-5 w-5" />
                                    ) : (
                                        <ShieldCheck className="h-5 w-5" />
                                    )}
                                    <span className="font-semibold">
                                        {isPhishing
                                            ? "URL ini terindikasi phishing."
                                            : "URL ini terdeteksi terpercaya."}
                                    </span>
                                </div>
                            )}

                            <div className="rounded-box border border-base-200 bg-base-100 p-6 shadow-xl">
                                <div className="text-center">
                                    <p className="text-sm font-medium text-base-content/60">
                                        Kemungkinan Phishing
                                    </p>

                                    {loading.phishing ? (
                                        <div className="mt-4 flex justify-center">
                                            <div className="skeleton h-[11rem] w-[11rem] rounded-full" />
                                        </div>
                                    ) : (
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
                                    )}

                                    <div className="mt-5 flex justify-center">
                                        {loading.phishing ? (
                                            <div className="skeleton h-6 w-28 rounded-full" />
                                        ) : (
                                            <span className={resultBadgeClass}>
                                                {isPhishing ? "Phishing" : "Terpercaya"}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-6 xl:grid-cols-[1.05fr_1.55fr]">
                                <div className="card border border-base-200 bg-base-100 shadow-xl">
                                    <div className="card-body">
                                        <h2 className="card-title text-xl">Hasil Scan</h2>

                                        {loading.insight ? (
                                            <div className="mt-4 space-y-4">
                                                <div>
                                                    <SkeletonLine className="h-4 w-28" />
                                                    <div className="mt-2 skeleton h-4 w-full" />
                                                </div>
                                                <div>
                                                    <SkeletonLine className="h-4 w-36" />
                                                    <div className="mt-2 skeleton h-4 w-full" />
                                                </div>
                                                <div>
                                                    <SkeletonLine className="h-4 w-24" />
                                                    <div className="mt-2 skeleton h-4 w-3/4" />
                                                </div>
                                                <div>
                                                    <SkeletonLine className="h-4 w-28" />
                                                    <div className="mt-2 skeleton h-4 w-1/2" />
                                                </div>
                                                <div>
                                                    <SkeletonLine className="h-4 w-32" />
                                                    <div className="mt-2 skeleton h-4 w-2/5" />
                                                </div>
                                                <div>
                                                    <SkeletonLine className="h-4 w-32" />
                                                    <div className="mt-2 skeleton h-4 w-1/3" />
                                                </div>
                                            </div>
                                        ) : (
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
                                                    <p className="mt-1 flex items-center gap-2">
                                                        {countryCode ? (
                                                            <ReactCountryFlag countryCode={countryCode} svg style={{ width: "1.2em", height: "1.2em" }} />
                                                        ) : null}
                                                        <span>{insightData?.location || "-"}</span>
                                                    </p>
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
                                                    <p className="mt-1">{formatTanggalIndonesia(insightData?.detection_date)}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="card border border-base-200 bg-base-100 shadow-xl">
                                    <div className="card-body">
                                        <h2 className="card-title text-xl">Screenshot</h2>

                                        <div className="mt-4 overflow-hidden rounded-box border border-dashed border-base-300 bg-base-200/30">
                                            <div className="min-h-[24rem] sm:min-h-[32rem] lg:min-h-[44rem]">
                                                {loading.screenshot ? (
                                                    <div className="flex h-full min-h-[24rem] items-center justify-center p-8 sm:min-h-[32rem] lg:min-h-[44rem]">
                                                        <div className="w-full space-y-4">
                                                            <div className="skeleton h-8 w-full rounded-box" />
                                                            <div className="skeleton h-8 w-11/12 rounded-box" />
                                                            <div className="skeleton h-8 w-10/12 rounded-box" />
                                                            <div className="skeleton h-48 w-full rounded-box" />
                                                        </div>
                                                    </div>
                                                ) : screenshotData?.screenshot_url ? (
                                                    <img
                                                        src={screenshotData.screenshot_url}
                                                        alt="Website screenshot"
                                                        className="h-full w-full object-contain object-top"
                                                    />
                                                ) : (
                                                    <div className="flex h-full min-h-[24rem] items-center justify-center p-8 text-center text-base-content/50 sm:min-h-[32rem] lg:min-h-[44rem]">
                                                        <div>
                                                            <ImageOff className="mx-auto h-10 w-10" />
                                                            <p className="mt-3">Screenshot web tidak tersedia</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="rounded-box border border-base-200 bg-base-100 p-4 shadow-xl">
                                    <div className="flex items-center gap-2">
                                        <Link2 className="h-4 w-4 text-primary" />
                                        <span className="font-medium">URL</span>
                                    </div>
                                    {loading.insight ? (
                                        <div className="mt-3 skeleton h-4 w-full" />
                                    ) : (
                                        <p className="mt-2 break-all text-sm text-base-content/70">
                                            {phishingData?.url || rawUrl}
                                        </p>
                                    )}
                                </div>

                                <div className="rounded-box border border-base-200 bg-base-100 p-4 shadow-xl">
                                    <div className="flex items-center gap-2">
                                        <Globe className="h-4 w-4 text-primary" />
                                        <span className="font-medium">Lokasi Server</span>
                                    </div>
                                    {loading.insight ? (
                                        <div className="mt-3 skeleton h-4 w-2/3" />
                                    ) : (
                                        <p className="mt-2 flex items-center gap-2 text-sm text-base-content/70">
                                            {countryCode ? (
                                                <ReactCountryFlag countryCode={countryCode} svg style={{ width: "1.2em", height: "1.2em" }} />
                                            ) : null}
                                            <span>{insightData?.location || "-"}</span>
                                        </p>
                                    )}
                                </div>

                                <div className="rounded-box border border-base-200 bg-base-100 p-4 shadow-xl">
                                    <div className="flex items-center gap-2">
                                        <Server className="h-4 w-4 text-primary" />
                                        <span className="font-medium">Hosting/IP</span>
                                    </div>
                                    {loading.insight ? (
                                        <div className="mt-3 skeleton h-4 w-1/2" />
                                    ) : (
                                        <p className="mt-2 text-sm text-base-content/70">
                                            {insightData?.hosting_provider || insightData?.ip_address || "-"}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="card border border-base-200 bg-base-100 shadow-xl">
                                <div className="card-body">
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                        <h2 className="card-title text-xl">Riwayat Sertifikat</h2>
                                        <p className="text-sm text-base-content/50">
                                            Tampilkan satu sertifikat terlebih dahulu, lalu perluas jika perlu.
                                        </p>
                                    </div>

                                    {loading.certificate ? (
                                        <div className="mt-4 space-y-4">
                                            <div className="rounded-box border border-base-200 bg-base-100 p-4">
                                                <div className="flex items-center justify-between gap-3">
                                                    <div className="skeleton h-4 w-32" />
                                                    <div className="skeleton h-6 w-16 rounded-full" />
                                                </div>
                                                <div className="mt-4 grid gap-3 md:grid-cols-2">
                                                    <div className="space-y-2">
                                                        <div className="skeleton h-4 w-24" />
                                                        <div className="skeleton h-4 w-full" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div className="skeleton h-4 w-24" />
                                                        <div className="skeleton h-4 w-full" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div className="skeleton h-4 w-24" />
                                                        <div className="skeleton h-4 w-full" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div className="skeleton h-4 w-24" />
                                                        <div className="skeleton h-4 w-full" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : certList.length > 0 ? (
                                        <>
                                            <div className="mt-4 space-y-4">
                                                {visibleCertificates.map((cert, index) => (
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

                                            {certList.length > 1 && (
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
                                        </>
                                    ) : (
                                        <div className="mt-4 flex items-center justify-center rounded-box border border-dashed border-base-300 bg-base-200/30 p-8 text-center text-base-content/50">
                                            <div>
                                                <Workflow className="mx-auto h-10 w-10" />
                                                <p className="mt-3">Riwayat sertifikat tidak tersedia</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

                <Footer />
            </div>
        </div>
    );
}