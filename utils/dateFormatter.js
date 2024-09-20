import { useTranslation } from "react-i18next";

const formatDate = itemDate => {

    const { i18n } = useTranslation();
    const date = new Date(itemDate);

    // Get 2-digit day
    const day = date.getDate().toString().padStart(2, '0');

    // Get short month in uppercase, followed by a period
    const month = date.toLocaleString(i18n.language, { month: 'short' }).replace('.', '') + '.';

    // Get last two digits of the year
    const year = date.getFullYear().toString().slice(-2);

    // Return the formatted date string
    return `${day} ${month} ${year}`;
}

export default formatDate