class FormatDate {
    async selectDays(date) {
        let month = date.substring(5);
        let year = date.substring(0, 4);

        date = new Date(year, month, 1);

        let firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        let lastDay = new Date(date.getFullYear(), date.getMonth(), 0);

        let monthString;
        switch (month) {
            case '01':
                monthString = "Janeiro";
                break;
            case '02':
                monthString = "Fevereiro";
                break;
            case '03':
                monthString = "Março";
                break;
            case '04':
                monthString = "Abril";
                break;
            case '05':
                monthString = "Maio";
                break;
            case '06':
                monthString = "Junho";
                break;
            case '07':
                monthString = "Julho";
                break;
            case '08':
                monthString = "Agosto";
                break;
            case '09':
                monthString = "Setembro";
                break;
            case '10':
                monthString = "Outubro";
                break;
            case '11':
                monthString = "Novembro";
                break;
            case '12':
                monthString = "Dezembro";
                break;
        }
        
        return { firstDay, lastDay, monthString }
    }
}

module.exports = new FormatDate();