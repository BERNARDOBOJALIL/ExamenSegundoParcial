const API_URL = "https://api-menu-9b5g.onrender.com/menu";

async function getMenu() {
    try {
        const response = await fetch(`${API_URL}`);
        if (!response.ok) throw new Error('Error fetching menu :(');
        return await response.json();;
    } catch (error) {
        throw error;
    }
            
}
export { getMenu };