let calc = {

    convertToFloat: function (str) {
        return parseFloat(str.replaceAll(',', '').replaceAll('$', ''));
    },

    calcMortgage: function (rate, periods, payment) {
        return payment / rate * (1 - Math.pow(1 + rate, -periods));
    },

    calcPayment: function (amount, rate, periods) {
        let payment = (amount * (rate / (1 - Math.pow(1 + rate, -periods))));
        return payment;
    },

    calcTotalPayment: function (payment, tax, hins, mins, hoa) {
        let total = payment + tax + hins + mins + hoa,
            $totals = `
                <div class="d-flex justify-content-between mb-3">
                    <div>Loan</div>
                    <div class="text-end" id="totals-loan">${formatter.format(payment)}</div>
                </div>
                <div class="d-flex justify-content-between mb-3">
                    <div>Property Tax</div>
                    <div class="text-end" id="totals-tax">${formatter.format(tax)}</div>
                </div>
                <div class="d-flex justify-content-between mb-3">
                    <div>Home Insurance</div>
                    <div class="text-end" id="totals-hins">${formatter.format(hins)}</div>
                </div>
                <div class="d-flex justify-content-between mb-3">
                    <div>Mortgage Insurance</div>
                    <div class="text-end" id="totals-mins">${formatter.format(mins)}</div>
                </div>
                <div class="d-flex justify-content-between mb-3">
                    <div>Homeowners Association</div>
                    <div class="text-end" id="totals-hoa">${formatter.format(hoa)}</div>
                </div>
                
                <div class="d-flex justify-content-between pt-3 border-top fw-semibold">
                    <div>Total Monthly Payment</div>
                    <div class="text-end" id="totals-total">${formatter.format(total)}</div>
                </div>
            `;

        return {
            total: total,
            totals: $totals
        }
    },

    createAmort: function (amount, rate, periods, payment) {
        let totalInterest = 0,
            balance = amount,
            $schedule;

        for (i = 1; i <= periods; i++) {
            let beg = balance,
                interest = (beg * rate),
                principle = payment - interest,
                end = beg - principle;

            balance = end;
            totalInterest += interest;
            $schedule += '<tr>' +
                '<td>' + i + '</td>' +
                '<td>' + formatter.format(beg) + '</td>' +
                '<td>' + formatter.format((principle + interest)) + '</td>' +
                '<td>' + formatter.format(interest) + '</td>' +
                '<td>' + formatter.format(principle) + '</td>' +
                '<td>' + formatter.format(balance) + '</td>'
            '</tr>';
        }

        return {
            totalInterest: formatter.format(totalInterest),
            percLoan: ((totalInterest / amount) * 100).toFixed(0) + `%`,
            schedule: $schedule
        };
    },

    createPrices: function (min, max, increment) {
        let c = min, prices = [min];
        while (c < max) {
            c += increment
            prices.push(c);
        }
        if (!prices.indexOf(max)) {
            prices.push(max);
        }
        return prices;
    },

    createComparisons: function (prices, down, rate, taxRate, term, insurance, hoa) {
        let comparisons = {},
            iPmt = (insurance / 12),
            hPmt = hoa,
            mRate = ((rate / 100) / 12);

        comparisons.price = [];
        comparisons.down = [];
        comparisons.mortgage = [];
        comparisons.loanToValue = [];
        comparisons.pmt = [];
        comparisons.tPmt = [];
        comparisons.iPmt = [];
        comparisons.hPmt = [];
        comparisons.total = [];
        comparisons.totalPerGross = [];
        comparisons.totalPerNet = [];

        for (price of prices) {
            let mortgage = (price - down),
                loanToValue = ((Math.round((mortgage / price) * 100) / 100) * 100).toFixed(0),
                pmt = this.calcPayment(mortgage, mRate, term),
                tPmt = (taxRate / 12),
                total = (pmt + tPmt + iPmt + hPmt);

            comparisons.price.push(price);
            comparisons.down.push(down);
            comparisons.mortgage.push(mortgage);
            comparisons.loanToValue.push(loanToValue);
            comparisons.pmt.push(pmt);
            comparisons.tPmt.push(tPmt);
            comparisons.iPmt.push(iPmt);
            comparisons.hPmt.push(hPmt);
            comparisons.total.push(total);
        }

        return comparisons
    },

    // compareRates: function () {
    //     let amount = 500000,
    //         periods = 30 * 12,
    //         rate1 = (3.99 / 12) / 100,
    //         rate2 = (2.99 / 12) / 100;

    //     payment1 = this.calcPayment(amount, rate1, periods);
    //     payment2 = this.calcPayment(amount, rate2, periods);

    //     console.log({
    //         payment1: payment1,
    //         payment2: payment2
    //     })
    // }
}
