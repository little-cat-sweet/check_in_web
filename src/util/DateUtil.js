
export const getNowDate = async () => {
    const date = new Date();
    date.setHours(0, 0, 0, 0); // 设置时间为当天的 00:00:00.000

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}T00:00:00.000Z`;
}


export default {
    getNowDate
}
