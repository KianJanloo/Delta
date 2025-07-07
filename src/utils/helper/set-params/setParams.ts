export const setParams = (name: string, value: string | number | boolean | Date) => {
    if (typeof window === 'undefined') return;
    
    const url = new URL(window.location.href);
    url.searchParams.set(name, value.toString());
    window.history.replaceState({}, '', url.toString());
}