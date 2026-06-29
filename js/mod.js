let modInfo = {
	name: "The create Tree",
	author: "iamtjyiscn and 473362",
	pointsName: "思索",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 600,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.2",
	name: "cell and atom update",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.1</h3><br>
		- 加入 "超弦" 层.<br>
	<h3>v0.2</h3><br>
		- 加入 "原子,细胞" 层.<br>
		- 加了一个库，以及加了“加数，乘数”设定，<br>
		- 公式变短了很多！<br>
		`

let winText = `你已到达当前终局`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

/** 
 * Calculate points/sec!
*/
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)
	let gain = new Decimal(1)
	if (hasUpgrade("line", 11))
		gain = gain.mul(upgradeEffect("line", 11))
	if (hasUpgrade("line", 12))
		gain = gain.mul(upgradeEffect("line", 12))
	if (hasUpgrade("line", 13))gain = gain.mul(tmp.line.upgrades[13].effect)
		
	gain=gain.mul(tmp.cell.effect)

	if(hasMilestone("atom",1))gain=gain.mul(tmp.atom.milestones[1].effect)
    gain = gain.mul(tmp.atom.buyables[11].effect)
	if(inChallenge("atom", 11)){
		gain=gain.pow(0.8);
	}
/*	if (hasUpgrade("line", 21))gain = gain.mul(tmp.line.upgrades[21].effect)
	if (hasUpgrade("line", 22))gain = gain.mul(tmp.line.upgrades[22].effect)
	if (hasUpgrade("line", 23))gain = gain.mul(tmp.line.upgrades[23].effect)*/
	gain=gain.mul(uE2("line",20).muler);//这很短
	//爆了
	//6666
	gain=gain.mul(player.atom.LP.add(1).pow(1.1))
	if(player.points.gte(new Decimal(1500000)))
		gain=gain.div(player.points.add(1).log10().pow(2).toNumber().toFixed(2))
	return gain
}

// Calculate the cost of an upgrade
function getBuyableCost(buyable) {
	if (buyable.id == "cell")
	gain = gain.mul(player.cell.ac.add(1).pow(0.7))
	
	if(player.points.gte(new Decimal(1500000)))
		gain=gain.div(player.points.add(1).log10().toNumber().toFixed(2))
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}
//软上限启动
// Display extra things at the top of the page
var displayThings = [
	function()
	{
		return "当前残局：超弦升级24"
	},
	function()
	{
		if(player.points.gte(new Decimal(1500000)))
		{
			return `软上限,启动！<br>目前：/${player.points.add(1).log10().pow(2).toNumber().toFixed(2)}`
		}
	},
]

// Determines when the game "ends"
function isEndgame() {
	return hasUpgrade("line", 24)
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}