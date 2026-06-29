function hasUpgrade(layer, id) {
	return ((player[layer].upgrades.includes(toNumber(id)) || player[layer].upgrades.includes(id.toString())) && !tmp[layer].deactivated)
}

function hasMilestone(layer, id) {
	return ((player[layer].milestones.includes(toNumber(id)) || player[layer].milestones.includes(id.toString())) && !tmp[layer].deactivated)
}

function hasAchievement(layer, id) {
	return ((player[layer].achievements.includes(toNumber(id)) || player[layer].achievements.includes(id.toString())) && !tmp[layer].deactivated)
}

function hasChallenge(layer, id) {
	return ((player[layer].challenges[id]) && !tmp[layer].deactivated)
}

function maxedChallenge(layer, id) {
	return ((player[layer].challenges[id] >= tmp[layer].challenges[id].completionLimit) && !tmp[layer].deactivated)
}

function challengeCompletions(layer, id) {
	return (player[layer].challenges[id])
}

function canEnterChallenge(layer, id){
	return tmp[layer].challenges[id].canEnter ?? true
}

function canExitChallenge(layer, id){
	return tmp[layer].challenges[id].canExit ?? true
}

function getBuyableAmount(layer, id) {
	return (player[layer].buyables[id])
}

function setBuyableAmount(layer, id, amt) {
	player[layer].buyables[id] = amt
}

function addBuyables(layer, id, amt) {
	player[layer].buyables[id] = player[layer].buyables[id].add(amt)
}

function getClickableState(layer, id) {
	return (player[layer].clickables[id])
}

function setClickableState(layer, id, state) {
	player[layer].clickables[id] = state
}

function getGridData(layer, id) {
	return (player[layer].grid[id])
}

function setGridData(layer, id, data) {
	player[layer].grid[id] = data
}

function upgradeEffect(layer, id) {
	return (tmp[layer].upgrades[id].effect)
}

function getTargetIDs(layer, id) {
  if (id < 10) {
    if (id === 0) return player[layer].upgrades;
    return tmp[layer].colMap.get(id) || [];
  } else {
    if (id % 10 === 0) {
      const row = id / 10;
      return tmp[layer].rowMap.get(row) || [];
    }
    return player[layer].upgrades.includes(id) ? [id] : [];
  }
}

function uE2(layer, id) {//这个函数还能优化
	if(tmp[layer].deactivated) return {adder:Decimal.dZero, muler:Decimal.dOne};

	let upg=tmp[layer].upgrades;
	
	let f;//过滤函数
	if (id < 10) {
	if (id == 0) {
		f = x => true;//00看全部
	} else {
		f = x => x % 10 == id;//0y看一列
	}
	} else {
	if (id % 10 == 0) {
		f = x => x > id && x - id <= 9;//x0看一行
	} else {
		f = x => x == id;//xy看本身
	}
	}
	const ans = {adder:Decimal.dZero, muler:Decimal.dOne};
	for(let upgid of player[layer].upgrades){
		//upgid的值域为x>10&&x%10!=0
		if(f(upgid)){
			if(upg[upgid].adder)ans.adder = ans.adder.add(upg[upgid].adder);
			if(upg[upgid].muler)ans.mler = ans.muler.mul(upg[upgid].muler);
		}
	}
	return ans;
}//行，那我改改
//爆爆？
//我发现我的ai会篡改我的话
//我不怎么用AI
//好像是好了
function challengeEffect(layer, id){
	return (tmp[layer].challenges[id].rewardEffect)
}

function mE2(layer,id){
	return hasMilestone(layer,id)?tmp[layer].milestones[id]:{
		adder:Decimal.dZero,muler:Decimal.dOne};
}

function buyableEffect(layer, id) {
	return (tmp[layer].buyables[id].effect)
}

function bE2(layer, id) {
	return (tmp[layer].buyables[id])
}
function clickableEffect(layer, id) {
	return (tmp[layer].clickables[id].effect)
}
function cE2(layer, id) {
	return (tmp[layer].clickables[id])
}

function achievementEffect(layer, id) {
	return (tmp[layer].achievements[id].effect)
}

function aE2(layer,id){
	return hasAchievement(layer,id)?tmp[layer].achievement[id]:{adder:Decimal.dZero,muler:Decimal.dOne};
}

function gridEffect(layer, id) {
	return (gridRun(layer, 'getEffect', player[layer].grid[id], id))
}