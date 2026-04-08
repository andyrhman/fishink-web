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
} from "lucide-react";
import { useState } from "react";

export default function ResultPage({ theme, toggleTheme }) {
    const [showAllCertificates, setShowAllCertificates] = useState(false);

    const resultData = {
        url: "https://fogu.com/hm/hmawl/events.php",
        normalizedUrl: "https://fogu.com/hm/hmawl/events.php",
        probabilityPercent: 80,
        prediction: "PHISHING",
        location: "Lansing, Michigan, United States",
        ipAddress: "64.91.250.113",
        topLevelDomain: "com",
        detectionDate: "5 April 2026, 09:20:53",
        screenshotUrl: null,
        certificateHistory: [
            {
                crtshId: "25343199811",
                issuerName: 'C=US, O="CLOUDFLARE, INC.", CN=Cloudflare TLS Issuing ECC CA 1',
                commonName: "search.chatgpt.com",
                nameValue: "*.search.chatgpt.com\nsearch.chatgpt.com",
                entryTimestamp: "2026-04-03T02:19:31Z",
                notBefore: "2026-04-03T01:43:28Z",
                notAfter: "2026-07-01T23:41:45Z",
            },
            {
                crtshId: "25343199812",
                issuerName: 'C=US, O="CLOUDFLARE, INC.", CN=Cloudflare TLS Issuing ECC CA 1',
                commonName: "search.chatgpt.com",
                nameValue: "*.search.chatgpt.com\nsearch.chatgpt.com",
                entryTimestamp: "2026-03-28T08:11:10Z",
                notBefore: "2026-03-28T07:10:00Z",
                notAfter: "2026-06-26T07:10:00Z",
            },
        ],
    };

    const isPhishing = resultData.prediction === "PHISHING";
    const resultBadgeClass = isPhishing ? "badge badge-error" : "badge badge-success";
    const alertClass = isPhishing ? "alert alert-error" : "alert alert-success";

    const visibleCertificates = showAllCertificates
        ? resultData.certificateHistory
        : resultData.certificateHistory.slice(0, 1);

    return (
        <div className="drawer lg:drawer-open">
            <input id="fishink-drawer" type="checkbox" className="drawer-toggle" />

            <div className="drawer-content flex min-h-screen flex-col bg-base-100 text-base-content">
                <Navbar theme={theme} toggleTheme={toggleTheme} />

                <main className="flex-1">
                    <section className="container mx-auto px-4 py-8 sm:py-12">
                        <div className="mx-auto max-w-6xl">
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

                            <div className="mt-8 text-center">
                                <p className="text-sm font-medium text-base-content/60">
                                    Kemungkinan Phishing
                                </p>

                                <div className="mt-4 flex justify-center">
                                    <div
                                        className={`radial-progress ${isPhishing ? "text-error" : "text-success"
                                            } border-2 border-base-300 bg-base-100`}
                                        style={{
                                            "--value": resultData.probabilityPercent,
                                            "--size": "10rem",
                                            "--thickness": "12px",
                                        }}
                                        role="progressbar"
                                    >
                                        <span className="text-2xl font-bold">
                                            {resultData.probabilityPercent}%
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-5 flex justify-center">
                                    <span className={resultBadgeClass}>
                                        {isPhishing ? "Phishing" : "Terpercaya"}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-10 grid gap-6 lg:grid-cols-2">
                                <div className="card border border-base-200 bg-base-100 shadow-sm">
                                    <div className="card-body">
                                        <h2 className="card-title text-xl">Hasil Scan</h2>

                                        <div className="mt-4 space-y-4 text-sm">
                                            <div>
                                                <p className="font-medium text-base-content/60">Sumber URL</p>
                                                <p className="mt-1 break-all">{resultData.url}</p>
                                            </div>

                                            <div>
                                                <p className="font-medium text-base-content/60">Normalisasi URL</p>
                                                <p className="mt-1 break-all">{resultData.normalizedUrl}</p>
                                            </div>

                                            <div>
                                                <p className="font-medium text-base-content/60">Location</p>
                                                <p className="mt-1">{resultData.location}</p>
                                            </div>

                                            <div>
                                                <p className="font-medium text-base-content/60">IP Address</p>
                                                <p className="mt-1">{resultData.ipAddress}</p>
                                            </div>

                                            <div>
                                                <p className="font-medium text-base-content/60">Top level domain</p>
                                                <p className="mt-1">{resultData.topLevelDomain}</p>
                                            </div>

                                            <div>
                                                <p className="font-medium text-base-content/60">Tanggal deteksi</p>
                                                <p className="mt-1">{resultData.detectionDate}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="card border border-base-200 bg-base-100 shadow-sm">
                                    <div className="card-body">
                                        <h2 className="card-title text-xl">Screenshot</h2>

                                        <div className="mt-4 flex min-h-[28rem] items-center justify-center rounded-box border border-dashed border-base-300 bg-base-200/30 p-4">
                                            {resultData.screenshotUrl ? (
                                                <img
                                                    src={resultData.screenshotUrl}
                                                    alt="Website screenshot"
                                                    className="h-full w-full rounded-box object-cover"
                                                />
                                            ) : (
                                                <div className="text-center text-base-content/50">
                                                    <Image className="mx-auto h-10 w-10" />
                                                    <p className="mt-3">Pratinjau screenshot akan muncul di sini.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 grid gap-4 md:grid-cols-3">
                                <div className="rounded-box border border-base-200 bg-base-100 p-4">
                                    <div className="flex items-center gap-2">
                                        <Link2 className="h-4 w-4 text-primary" />
                                        <span className="font-medium">URL</span>
                                    </div>
                                    <p className="mt-2 break-all text-sm text-base-content/70">{resultData.url}</p>
                                </div>

                                <div className="rounded-box border border-base-200 bg-base-100 p-4">
                                    <div className="flex items-center gap-2">
                                        <Globe className="h-4 w-4 text-primary" />
                                        <span className="font-medium">Lokasi Server</span>
                                    </div>
                                    <p className="mt-2 text-sm text-base-content/70">{resultData.location}</p>
                                </div>

                                <div className="rounded-box border border-base-200 bg-base-100 p-4">
                                    <div className="flex items-center gap-2">
                                        <Server className="h-4 w-4 text-primary" />
                                        <span className="font-medium">Hosting/IP</span>
                                    </div>
                                    <p className="mt-2 text-sm text-base-content/70">{resultData.ipAddress}</p>
                                </div>
                            </div>

                            <div className="mt-10">
                                <div className="card border border-base-200 bg-base-100 shadow-sm">
                                    <div className="card-body">
                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                            <h2 className="card-title text-xl">Riwayat Sertifikat</h2>
                                            <p className="text-sm text-base-content/50">
                                                Tampilkan satu sertifikat terlebih dahulu, lalu perluas jika perlu.
                                            </p>
                                        </div>

                                        <div className="mt-4 space-y-4">
                                            {visibleCertificates.map((cert, index) => (
                                                <div key={cert.crtshId} className="rounded-box border border-base-200 bg-base-100 p-4">
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
                                                            <p className="mt-1 break-all">{cert.issuerName}</p>
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-base-content/60">Common Name</p>
                                                            <p className="mt-1 break-all">{cert.commonName}</p>
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-base-content/60">Nama Domain</p>
                                                            <p className="mt-1 whitespace-pre-line break-all">{cert.nameValue}</p>
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-base-content/60">Waktu Entri</p>
                                                            <p className="mt-1 break-all">{cert.entryTimestamp}</p>
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-base-content/60">Not Before</p>
                                                            <p className="mt-1 break-all">{cert.notBefore}</p>
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-base-content/60">Not After</p>
                                                            <p className="mt-1 break-all">{cert.notAfter}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {resultData.certificateHistory.length > 1 && (
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
                            </div>
                        </div>
                    </section>
                </main>

                <Footer />
            </div>
        </div>
    );
}