module.exports = statement;

function statement(invoice, plays) {
    let statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances.map(enrichPerformance);
    return renderPlainText(statementData, plays);

    function enrichPerformance(perf) {
        let result = Object.assign({}, perf);
        result.play = playFor(result);
        result.amount = amountFor(result);
        return result;
    }

    function playFor(perf) {
        return plays[perf.playID];
    }

    function amountFor(perf) {
        let result = 0;

        switch (perf.play.type) {
            case 'tragedy':
                result = 40000;
                if (perf.audience > 30) {
                    result += 1000 * (perf.audience - 30);
                }
                break;
            case 'comedy':
                result = 30000;
                if (perf.audience > 20) {
                    result += 10000 + 500 * (perf.audience - 20);
                }
                result += 300 * perf.audience;
                break;
            default:
                throw new Error(`unknow type: ${perf.play.type}`);
        }

        return result;
    }
}

function renderPlainText(data) {
    let result = `Statement for ${data.customer}\n`;
    for (let perf of data.performances) {
        //print line for this order
        result += ` ${perf.play.name}: ${usd(perf.amount / 100)} (${perf.audience} seats)\n`;
    }

    result += `Amount owed is ${usd(totalAmount() / 100)}\n`;
    result += `You earned ${totalVolumeCredits()} credits \n`;

    return result;

    function volumeCreditsFor(perf) {
        let result = 0;
        // add volume credits
        result += Math.max(perf.audience - 30, 0);
        // add extra credit for every ten comedy attendees
        if ('comedy' === perf.play.type) result += Math.floor(perf.audience / 5);

        return result;
    }

    function usd(num) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(num);
    }

    function totalVolumeCredits() {
        let volumeCredits = 0;
        for (let perf of data.performances) {
            volumeCredits += volumeCreditsFor(perf);
        }
        return volumeCredits;
    }

    function totalAmount() {
        let result = 0;
        for (let perf of data.performances) {
            result += perf.amount;
        }
        return result;
    }
}
