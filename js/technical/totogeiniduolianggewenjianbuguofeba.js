/**
 * 这编码了一些东西，可以让公式更短，到this用不上的程度
 * 
 */
function valMap(s){
    a=s.split(/[a-z]+/);
    for(i in a)
        a[i]=a[i].toLowerCase();
    switch("".concat(...s.split(/[A-Z0-9]+/))){
        case 'u':
            return `hasUpgrade('${a[0]}',${a[1]})`;
        case 'm':
            return `hasMilestone('${a[0]}',${a[1]})`;
        case 'a':
            return `hasAchievement('${a[0]}',${a[1]})`;
        case "c":
            return `hasChallenge('${a[0]}',${a[1]})`;
        
        case 'b':
            return `player['${a[0]}'].buyables[${a[1]}]`;
        case 'k':
            return `player['${a[0]}'].clickables[${a[1]}]`;
        case 'g':
            return `player['${a[0]}'].grid[${a[1]}]`;
        case 'ue':
            return `upgradeEffect('${a[0]}',${a[1]})`;
        case 'ce':
            return `challengeEffect('${a[0]}',${a[1]})`;

        
        case 'p':
            return `player['${a[0]}'].points`;


        default:
            return s;
    }
}


Decimal.metaConstructor=function(x){
	const dnum=new Decimal(x);
	return `_(${dnum.sign},${dnum.layer},${dnum.mag})`
}