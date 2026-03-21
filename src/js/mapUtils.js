const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org";

/**
 * 1. 逆地理编码：坐标 -> 地名
 * @param {number} lat - 纬度
 * @param {number} lng - 经度
 * @returns {Promise<string>} - 返回详细地址字符串
 */
export async function getAddressFromCoords(lat, lng) {
    try {
        const url = `${NOMINATIM_BASE_URL}/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
        const response = await fetch(url, {
            headers: { 'User-Agent': 'ViewEye-App' }
        });
        
        if (!response.ok) throw new Error("Request failed");
        
        const data = await response.json();
        return data.display_name || "Unknown";
    } catch (error) {
        console.error("Locating error: ", error);
        return "Locating failed";
    }
}

/**
 * 2. 地理编码：地名 -> 坐标
 * @param {string} address - 地名或详细地址
 * @returns {Promise<{lat: number, lng: number}|null>} - 返回坐标对象或 null
 */
export async function getCoordsFromAddress(address) {
    try {
        const url = `${NOMINATIM_BASE_URL}/search?format=jsonv2&q=${encodeURIComponent(address)}`;
        
        const response = await fetch(url, {
            headers: { 'User-Agent': 'ViewEye-App' }
        });
        
        const data = await response.json();
        
        if (data && data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon),
                displayName: data[0].display_name
            };
        }
        return null;
    } catch (error) {
        console.error("Locating error: ", error);
        return null;
    }
}