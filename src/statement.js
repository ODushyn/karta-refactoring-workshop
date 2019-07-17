module.exports = statement;

function statement(invoice, plays) {
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = `Statement for ${invoice.customer}\n`;

    for (let perf of invoice.performances) {
        volumeCredits += volumeCreditsFor(perf);
        //print line for this order
        result += ` ${playFor(perf).name}: ${usd(amountFor(perf) / 100)} (${perf.audience} seats)\n`;
        totalAmount += amountFor(perf);
    }

    result += `Amount owed is ${usd(totalAmount / 100)}\n`;
    result += `You earned ${volumeCredits} credits \n`;

    return result;

    function amountFor(perf) {
        let result = 0;

        switch (playFor(perf).type) {
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
                throw new Error(`unknow type: ${playFor(perf).type}`);
        }

        return result;
    }

    function playFor(perf) {
        return plays[perf.playID];
    }

    function volumeCreditsFor(perf){
        let result = 0;
        // add volume credits
        result += Math.max(perf.audience - 30, 0);
        // add extra credit for every ten comedy attendees
        if ('comedy' === playFor(perf).type) result += Math.floor(perf.audience / 5);

        return result;
    }

    function usd(num) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(num);
    }
}
