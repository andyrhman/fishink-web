import countries from "i18n-iso-countries";

export function getCountryNameFromLocation(location) {
    if (!location) return "";
    const parts = location.split(",").map((part) => part.trim()).filter(Boolean);
    return parts[parts.length - 1] || "";
}

export function getCountryCodeFromLocation(location) {
    const countryName = getCountryNameFromLocation(location);
    if (!countryName) return "";
    return countries.getAlpha2Code(countryName, "en") || "";
}

export function formatTanggalIndonesia(dateString) {
    if (!dateString) return "-";

    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "-";

    return new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "Asia/Makassar",
    }).format(date);
}