export const fetchNewPlaces = async () => {
    const item = {
        id: '2',
        title: ' اقمتگاه دال در قشم ',
        rate: '3.2',
        categories: {
            id: 1,
            name: ' 11.000 نفر بازدید کننده '
        },
    }
    const items = [
        item,
        item,
        item,
        item,
        item,
    ]
    return items
}