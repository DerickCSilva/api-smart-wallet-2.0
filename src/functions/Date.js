class Date {
    async selectDays(date) {
        let month = date.substring(5);
        let startDate = `${date}-01`;

        let endDate;
        switch (month) {
            case '01':
            case '03':
            case '05':
            case '07':
            case '08':
            case '10':
            case '12':
                endDate = `${date}-31`
                break;

            case '02':
                endDate = `${date}-28`
                break;
                
            case '04':
            case '06':
            case '09':
            case '11':
                endDate = `${date}-30`
                break;
        }
        console.log(moment);
        return { startDate, endDate }
    }
}

module.exports = new Date();