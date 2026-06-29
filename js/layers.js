//
addLayer("line", {
    name: "超弦", 
    symbol: "L", 
    position: 0, 
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#464646",
    requires: new Decimal(10), // 重置所需的基础资源数量，可以是考虑需求增长后的函数
    resource: "超弦", // 声望货币的名称
    baseResource: "思索", // 声望所基于的资源名称
    baseAmount() {return player.points}, // 获取当前基础资源的数量
    type: "normal", // normal：获取货币的成本取决于已获得的数量。static：成本取决于你已拥有的数量
    exponent: 0.5, // 声望货币的指数
    gainMult() { // 计算来自加成的主货币倍率
        mult = new Decimal(1)
        
        if(hasMilestone("atom",1))mult = mult.mul(tmp.atom.effect)//666我说错了🤔
        if(hasUpgrade("line",12))mult=mult.mul(4);
        if(hasUpgrade("line", 13))mult = mult.mul(tmp.line.upgrades[13].effect)
        mult = mult.mul(player.atom.He3.add(1).pow(0.3))
        mult = mult.mul(player.cell.pc.add(1).pow(0.7))
        return mult//早。
    },
    gainExp() { // 计算来自加成的主货币指数
        return new Decimal(1)
    },
    layerShown(){return true},
    row: 0, // 层在树中所处的行（0 是第一行）
    upgrades: {
        11: {
            title: "第一次一重折叠",
            description: "思索的获取速度翻倍",
            cost: new Decimal(1),
            effect() {
                return new Decimal(2)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // 用于显示升级效果的函数
            unlocked() {return true}
        },//孩子们，这些公式叠的这么恐怖居然能蒸
        12: {
            title: "第二次一重折叠",
            description: "思索和弦的获取速度到翻3倍",
            cost: new Decimal(4),
            effect() {
                return new Decimal(3)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            unlocked() {return hasUpgrade("line", 11)},
        },
        13: {
            title: "一重折叠成功",
            description: "获得的思索和弦乘上弦的位数",//人话：log
            cost: new Decimal(10),
            effect:"$floor(log10(max(LINEp,2)))+1",
            effectDisplay() { return "x"+formatWhole(upgradeEffect(this.layer, this.id)) },
            unlocked() {return hasUpgrade("line", 12)},
        },
        21: {
            title: "第1次二重折叠",
            description: "将思索的获取速度翻升级数量的exp倍",
            cost: "$1e3",
            muler() {
                return new Decimal(Math.exp(player.line.upgrades.length))
            },
            effectDisplay() { return format(tmp.line.upgrades[21].muler)+"x" }, // 用于显示升级效果的函数
            unlocked() {
                return hasMilestone("cell",0)//cell太牢了，让他去解锁吧
            }
        },
        22: {
            title: "第2次二重折叠",
            description: "思索和弦的获取速度乘时间+10",
            cost: new Decimal(1e5),
            muler(){
                return new Decimal(player.line.resetTime+10)
            },
            effectDisplay() { return format(tmp.line.upgrades[22].muler)+"x" },
            unlocked() {return hasUpgrade("line", 21)},
        },
        23: {//等等，我杀一下内存
            title: "第3次二重折叠",
            description: "为什么这次没有成功折叠？<br>好吧，更高层面的难度远比我想象的大<br>获得的思索和弦乘上弦的位数的10次方",//人话：log
            cost: new Decimal(1e8),
            muler:"$(floor(log10(max(LINEp,2)))+1)^10",
            effectDisplay() { return "x"+formatWhole(tmp.line.upgrades[23].muler) },
            unlocked() {return hasUpgrade("line", 22)},
        },
        24: {
            title: "二重折叠成功",
            description: "成功了，我们终于能触及更高的知识了，这也许能帮助我重构……<br>解锁数学",
            cost: new Decimal(1e70),
            effectDisplay() { return "解锁数学" },
            unlocked() {return hasUpgrade("line", 23)},
            //先别写单位子的代码，先写日志
    }//爆！！！！！！！！！！！！！！！！
}});
//细胞层
addLayer("cell", {
    name: "细胞", 
    symbol: "C", 
    position: 0, 
    startData() { return {
        unlocked: false,//是否解锁
		points: new Decimal(0),//细胞
        sc:new Decimal(1),//小细胞
        wait:new Decimal(0),//等待时间
        dwait:new Decimal(20),//废弃
        sclong:new Decimal(1),//小细胞长度
        sclongneed:new Decimal(10),//小细胞长度需求
        pc:new Decimal(0),//植物细胞
        ac:new Decimal(0),//动物细胞
    }
        //神秘，这9个量都是什么？
},
    color: "#30d146",
    //我得想个办法让解锁对面那个里程碑之后这个层的要求*100000，你有办法吗
    requires() { 
    // 获取基础需求，这里是 200
    let baseRequirement = new Decimal(200);
    
    // 检查对面里程碑是否已解锁
    // 假设对面层的ID是 "oppositeLayer"，里程碑ID是 0
    // 请根据您的实际情况修改这两个值
    if (hasMilestone("atom", 0)) {
        // 如果已解锁，则需求乘以 100,000
        
        if (hasMilestone("cell", 0)) {
            // 如果已解锁，则需求变回去
            return baseRequirement;
        }
        return baseRequirement.times(10000000);
        
    }
    // 否则返回基础需求
    return baseRequirement;
    },
    tabFormat: ["main-display",
			"prestige-button",
			"blank",
			["display-text",
				function() {return '你有 ' + format(player.cell.sc) + ' 小细胞，尺寸为'+format(player.cell.sclong)+'，增幅原子与超弦获取 '+format(player.cell.sc.add(1).pow(0.3).mul(player.cell.sclong))+'x'},
					{}],["display-text",
				function() {return '你有 ' + format(player.cell.pc) + ' 植物细胞，尺寸为'+format(player.cell.sclong)+'，增幅超弦获取 '+format(player.cell.pc.add(1).pow(0.7).mul(player.cell.sclong))+'x'},
					{}],["display-text",
				function() {return '你有 ' + format(player.cell.ac) + ' 动物细胞，尺寸为'+format(player.cell.sclong)+'，增幅思索获取 '+format(player.cell.ac.add(1).pow(0.7).mul(player.cell.sclong))+'x'},
					{}],
			"blank",
			
			"blank",
			"milestones","buyables","blank","challenges","blank", "upgrades","clickables"],
    resource: "细胞", // 声望货币的名称
    baseResource: "思索", // 声望所基于的资源名称
    baseAmount() {return player.points}, // 获取当前基础资源的数量
    type: "normal", // normal：获取货币的成本取决于已获得的数量。static：成本取决于你已拥有的数量
    exponent: 0.55, // 声望货币的指数
    effect() {
      return player.cell.points.add(1).pow(0.8)  
    },
    effectDescription() {
    // 获取当前细胞数量
    let cells = player[this.layer].points;
    
    // 返回带有换行和动态获取数量的描述
    return `\n为思索获取速度提供 ${format(this.effect())}x 的加成。`;
    },gainMult() {
    mult = new Decimal(1)
    // 检查层是否解锁以及buyables是否存在
    if (tmp.atom?.unlocked && tmp.atom?.buyables?.[11]) {
        mult = mult.mul(tmp.atom.buyables[11].effect)
    }
    return mult//我去喝个水
    },
    //我跟你说，即使层或里程碑什么什么的未解锁，仍然会计算的
    //另外，我觉得这树需要加数和乘数
    //孩子们修好了
    gainExp() { // 计算来自加成的主货币指数
        return new Decimal(1)
    },
    layerShown(){
        if(hasUpgrade("line", 13)) return true
        if(tmp.atom.unlocked){
            if(player.atom.points.gte(1)) return true
        }
        if(tmp.cell.unlocked){
            if(player.cell.points.gte(1)) return true
        }
        if(hasMilestone("atom", 0)) return true
        if(hasMilestone("cell", 0)) return true
    },
    row: 1, // 层在树中所处的行（0 是第一行）
    milestones: {
        0: {
            requirementDescription: "获得1个细胞",
            done() { return player.cell.points.gte(1) },
            effectDescription: "你居然选择我进行重置,气死我了我让你的原子解锁要求*10000000<br>等你选了对面我就解除<br>解锁二重折叠",
            effect() {
                return player.cell.points.add(1).pow(0.5)
            }
        },
        1: {
            requirementDescription: "获得10个细胞",
            done() { return player.cell.points.gte(10) },
            effectDescription: "解锁细胞分裂",
        },
        2: {
            requirementDescription: "获得150个细胞",
            done() { return player.cell.points.gte(150) },
            effectDescription: "解锁细胞生长",
        },
        3: {
            requirementDescription: "获得500个细胞",
            done() { return player.cell.points.gte(500) },
            effectDescription: "解锁细胞分化",
        },
    },//写成粪便了。//。
    //点一下分裂？，分裂有冷却，行
    //是分裂化细胞在分裂（，不影响细胞数量
    clickables: {
    11: {
        title: "分裂",
        display() {return "执行一次分裂,你的小细胞数量x"+format(this.effect())+"，剩余分裂冷却"+format(player.cell.wait)+"秒"},
        onClick(){
            player.cell.wait=player.cell.sc.add(1).root(player.cell.points.max(10).ln());//孩子们我说这个冷却会降低的
            //俺寻思我已经把底数存了
            //666宇宙热级了都等不到
            //俺寻思player.cell.wait只是个计时器
            //hyw
            //player.cell.wait只是个计时器，记了剩余分裂冷却时间
            player.cell.sc=player.cell.sc.mul(this.effect())
            //正在访问https://p-u.github.io/The-Point-Tree/
            //我抄抄点树
        },
        canClick(){
            return ((player.cell.wait.lte(0)))
        },
        effect(){return new Decimal(2)},
        unlocked() {return hasMilestone(this.layer, 1)},
    },
    12: {
        title: "生长",
        display() {return "执行一次生长,你的小细胞长度+"+format(this.effect())+"，需要"+format(player.cell.sclongneed)+"个细胞(不消耗)"},
        onClick(){
            player.cell.sclongneed=player.cell.sclongneed.mul(10);
            player.cell.sclong=player.cell.sclong.add(this.effect())
        },
        canClick(){
            return ((player.cell.points.gte(player.cell.sclongneed)))
        },
        effect(){return new Decimal(1)},
        unlocked() {return hasMilestone(this.layer, 2)
        },
        effect(){return new Decimal(1)},
        unlocked() {return hasMilestone(this.layer, 2)},
    },
    
    13: {
        title: "分化",
        display() {return "执行一次分化,将你的细胞分化为50%植物细胞和50%动物细胞"},
        onClick(){
            player.cell.pc=player.cell.pc.add(player.cell.points.mul(0.5));
            player.cell.ac=player.cell.ac.add(player.cell.points.mul(0.5));
            player.cell.points=new Decimal(0);//这里怎么设置了个滚木啊
            //因为你前面打错了
            //666
        },
        canClick(){
            return (player.cell.points.gte(1))
        },
        effect(){return new Decimal(1)},
        unlocked() {return hasMilestone(this.layer, 3)
        },
    },
    
    14: {
        title: "培养",
        display() {return "使用你的细胞进行培养,你的细胞数量+"+format(this.effect())+"，需要"+format(player.cell.sc.add(1).pow(1.1))+"原子"},
        onClick(){
            player.atom.points=player.atom.points.sub(player.cell.sc.add(1).pow(1.1));
            player.cell.sc=player.cell.sc.add(this.effect());
            //只是这两行反了
        },//我打算把这个传到github，让全世界的人吃到大奉
        //好
        canClick(){
            return (player.atom.points.gte(player.cell.sc.add(1).pow(1.1)))
        },
        effect(){return new Decimal(player.cell.sc.mul(0.7).pow(1.1).mul(0.1))},
        unlocked() {return hasMilestone(this.layer, 3)
        },
    },
},
update(diff) {
    if (player.cell.wait.gt(0)) {
        player.cell.wait = player.cell.wait.sub(diff)
        if (player.cell.wait.lte(0)) {
            player.cell.wait=new Decimal(0)
            }
        if (player.cell.wait.gt(player.cell.sc.add(1).root(player.cell.points.max(10).ln()))) {
            player.cell.wait=player.cell.sc.add(1).root(player.cell.points.max(10).ln())
            }
    }
}
});

//原子层
addLayer("atom", {
    name: "原子", 
    symbol: "A", 
    position: 1, 
    color: "#665e72",
        tabFormat: [
        'main-display',
        'prestige-button',
        'blank',
        ['display-text',
        function () {
            return `你有 ${format(player.atom.He3)} He3，增幅原子与超弦获取 ${format(player.atom.He3.add(1).pow(0.3))} x`
        },{},
        ],[
        'display-text',
        function () {
            return `你有 ${format(player.atom.LP)} 电子，增幅思索获取 ${format(player.atom.LP.add(1).pow(1.1))} x`
        },{},],'blank','blank',
        'milestones',
        'buyables','blank',
        'challenges','blank',
        'upgrades',
    ],
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        He3:Decimal.dZero,
        LP:Decimal.dZero,
    }},


    requires() { 
    // 获取基础需求，这里是 200
    let baseRequirement = new Decimal(200);
    
    // 检查对面里程碑是否已解锁
    // 假设对面层的ID是 "oppositeLayer"，里程碑ID是 0
    // 请根据您的实际情况修改这两个值
    if (hasMilestone("cell", 0)) {
        // 如果已解锁，则需求乘以 100,000
        
        if (hasMilestone("atom", 0)) {
            // 如果已解锁，则需求变回去
            return baseRequirement;
        }
        return baseRequirement.times(10000000);
        
    }
    // 否则返回基础需求
    return baseRequirement;
    },
    resource: "原子", // 声望货币的名称
    baseResource: "思索", // 声望所基于的资源名称
    baseAmount() {return player.points}, // 获取当前基础资源的数量
    type: "normal", // normal：获取货币的成本取决于已获得的数量。static：成本取决于你已拥有的数量
    exponent: 0.65, // 声望货币的指数
    
    effect() {
      return player.atom.points.add(1).pow(0.5)  
    },
    effectDescription() {
    // 获取当前原子数量
    let atoms = player[this.layer].points;
    
    // 返回带有换行和动态获取数量的描述
    return `\n为超弦获取提供 ${format(this.effect())}x 的加成。`;
    },
    gainMult() { // 计算来自加成的主货币倍率
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // 计算来自加成的主货币指数
        return new Decimal(1)
    },
    layerShown(){
        if(hasUpgrade("line", 13)) return true
        if(player.atom.points.gte(1)) return true
        if(player.cell.points.gte(1)) return true
        if(hasMilestone("atom", 0)) return true
        if(hasMilestone("cell", 0)) return true
    },
    row: 1, // 层在树中所处的行（0 是第一行）
    milestones: {
        0: {
            requirementDescription: "获得1个原子",
            done() { return player.atom.points.gte(1) },
            effectDescription: "你居然选择我进行重置,气死我了我让你的细胞解锁要求*10000000<br>等你选了对面我就解除"//是个里程碑
        },
        1: {
            requirementDescription: "获得5个原子",//是我数值给低了还是有bug，0.00直接趋势了罢忘了写成函数了
            done() { return player.atom.points.gte(5) },//好了
            effectDescription:()=> `基于超弦加成思索获取速度<br>当前:${format(tmp.atom.milestones[1].effect)}x`,
            effect() {//这么强！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
                return player.line.points.add(1).pow(0.5)
            },
        },
        2: {//头脑风暴中
            requirementDescription: "获得25个原子",
            done:"$ATOMp>=25",
            effectDescription:()=> `解锁一些升级`,
            effect:"$114514"//我试一些下的库
        },
    },
    buyables: {
                11: {title: "氢分子",
        unlocked() { return hasUpgrade("atom", 11) }, // 修复解锁条件
        cost(x) { return x.pow(2) },
        display() { 
            let amount = getBuyableAmount(this.layer, this.id);
            return `${this.title}<br>成本：${format(this.cost(amount))} 分子<br>拥有：${formatWhole(amount)}<br>为细胞获取与思索获取提供加成：<br>${format(this.effect(amount))}x`;
        },
        canAfford() { 
            let amount = getBuyableAmount(this.layer, this.id);
            return player[this.layer].points.gte(this.cost(amount)); 
        },
        buy() {
            let amount = getBuyableAmount(this.layer, this.id);
            let cost = this.cost(amount);
            player[this.layer].points = player[this.layer].points.sub(cost);
            setBuyableAmount(this.layer, this.id, amount.add(1));
        },
        effect(x) { // 添加效果函数
            let amount = x || getBuyableAmount(this.layer, this.id);
            return new Decimal(1).add(amount.mul(0.5)); // 示例效果：每个水分子提供+50%加成
        },

        },
    },
            //我的库好像……
            //"$ATOMu11"是hasUpgrade('atom',11)//666
            //我刚刚去测了一下平衡
            //那超弦就给获取打压一下（）
            //好像涨的有点快了
            //好的，削了
            //我的浮木叫我去睡觉
            //神人学校还得去一周
            //我记着这个share是可以下载项目的，我下了
    onPurchase(){
      player.atom.LP = player.atom.points
    },
    challenges: {
    //挑战//咋做来着想想先
        11: {
            name: "α衰变",
            challengeDescription: "思索降低^0.8,但基于你的原子产生氦-3,增长缓慢？",
            //只是从一种加成转换成另一种罢了（？
            canComplete: function() {return player.line.points.gte(1e5)},
            rewardDescription: "你可在挑战外基于原子获取氦-3,解锁β衰变",//我打一把试试
            goalDescription: "获得1e5个超弦",
            rewardEffect() {
                return player.atom.points.add(1).pow(0.3)
            },//挑战的奖励是解锁……，所以效果不是一个Decimal 吧？
            rewarddisplay() {
                return `基于原子获取氦-3,当前:${format(tmp.atom.challenges[11].rewardEffect)}He3/s`
            },
            unlocked() { return hasUpgrade("atom", 12) },
            onEnter(){
                player.atom.He3=new Decimal(0)
            },
            onExit(){
                player.atom.He3=new Decimal(0)
            }
        },
        12: {
            name: "β衰变",
            challengeDescription: "游戏速度降低x0.5，思索降低^0.8,但基于你的原子获得电子,电子在每次原子重置获取或者在挑战中持续获取，电子会不断消逝",
            canComplete: function() {return player.line.points.gte(1e6)},
            rewardDescription: "你可在挑战外每次原子获取电子",
            goalDescription: "获得1e6个超弦",
            rewardEffect() {
                return player.atom.points.add(1).pow(0.3)
            },
            rewarddisplay() {
                return `基于原子获取LP,当前:${format(tmp.atom.challenges[11].rewardEffect)}LP/s`
            },
            unlocked() { return maxedChallenge("atom", 11) },
            onEnter(){
                player.atom.LP=new Decimal(0)
            },
            onExit(){
                player.atom.LP=new Decimal(0)
                if(maxedChallenge("atom",12))
                    player.atom.LP=player.atom.points
            }
        },
    },//帮你缩进
    update(diff){
        if(inChallenge("atom", 11)||maxedChallenge("atom",11)){
            player.atom.He3 = player.atom.He3.add(player.atom.points.add(1).pow(0.3).times(diff??0))
        }
        //进去之后一直培养就炸了
        //eyJ0YWIiOiJvcHRpb25zLXRhYiIsIm5hdlRhYiI6InRyZWUtdGFiIiwidGltZSI6MTc4MjcwNDg2MDU2Niwibm90aWZ5Ijp7fSwidmVyc2lvblR5cGUiOiJUaGUtY3JlYXRlLVRyZWUtaWFtdGp5aXNjbi1hbmQtNDczMzYyIiwidmVyc2lvbiI6IjAuMiIsInRpbWVQbGF5ZWQiOjY4MzkuMTI0NTA2NTEyNzE3LCJrZWVwR29pbmciOmZhbHNlLCJoYXNOYU4iOmZhbHNlLCJwb2ludHMiOiIxLjA0Nzc4NzE5NjcwOTc5MzhlMTQwIiwic3VidGFicyI6eyJjaGFuZ2Vsb2ctdGFiIjp7fX0sImxhc3RTYWZlVGFiIjoiY2VsbCIsImluZm9ib3hlcyI6e30sImluZm8tdGFiIjp7InVubG9ja2VkIjp0cnVlLCJ0b3RhbCI6IjAiLCJiZXN0IjoiMCIsInJlc2V0VGltZSI6NjgzOS4xMjQ1MDY1MTI3MTcsImZvcmNlVG9vbHRpcCI6ZmFsc2UsImJ1eWFibGVzIjp7fSwibm9SZXNwZWNDb25maXJtIjpmYWxzZSwiY2xpY2thYmxlcyI6e30sInNwZW50T25CdXlhYmxlcyI6IjAiLCJ1cGdyYWRlcyI6W10sIm1pbGVzdG9uZXMiOltdLCJsYXN0TWlsZXN0b25lIjpudWxsLCJhY2hpZXZlbWVudHMiOltdLCJjaGFsbGVuZ2VzIjp7fSwiZ3JpZCI6e30sInByZXZUYWIiOiIifSwib3B0aW9ucy10YWIiOnsidW5sb2NrZWQiOnRydWUsInRvdGFsIjoiMCIsImJlc3QiOiIwIiwicmVzZXRUaW1lIjo2ODM5LjEyNDUwNjUxMjcxNywiZm9yY2VUb29sdGlwIjpmYWxzZSwiYnV5YWJsZXMiOnt9LCJub1Jlc3BlY0NvbmZpcm0iOmZhbHNlLCJjbGlja2FibGVzIjp7fSwic3BlbnRPbkJ1eWFibGVzIjoiMCIsInVwZ3JhZGVzIjpbXSwibWlsZXN0b25lcyI6W10sImxhc3RNaWxlc3RvbmUiOm51bGwsImFjaGlldmVtZW50cyI6W10sImNoYWxsZW5nZXMiOnt9LCJncmlkIjp7fSwicHJldlRhYiI6IiJ9LCJjaGFuZ2Vsb2ctdGFiIjp7InVubG9ja2VkIjp0cnVlLCJ0b3RhbCI6IjAiLCJiZXN0IjoiMCIsInJlc2V0VGltZSI6NjgzOS4xMjQ1MDY1MTI3MTcsImZvcmNlVG9vbHRpcCI6ZmFsc2UsImJ1eWFibGVzIjp7fSwibm9SZXNwZWNDb25maXJtIjpmYWxzZSwiY2xpY2thYmxlcyI6e30sInNwZW50T25CdXlhYmxlcyI6IjAiLCJ1cGdyYWRlcyI6W10sIm1pbGVzdG9uZXMiOltdLCJsYXN0TWlsZXN0b25lIjpudWxsLCJhY2hpZXZlbWVudHMiOltdLCJjaGFsbGVuZ2VzIjp7fSwiZ3JpZCI6e30sInByZXZUYWIiOiIifSwiYmxhbmsiOnsidW5sb2NrZWQiOnRydWUsInRvdGFsIjoiMCIsImJlc3QiOiIwIiwicmVzZXRUaW1lIjo2ODM5LjEyNDUwNjUxMjcxNywiZm9yY2VUb29sdGlwIjpmYWxzZSwiYnV5YWJsZXMiOnt9LCJub1Jlc3BlY0NvbmZpcm0iOmZhbHNlLCJjbGlja2FibGVzIjp7fSwic3BlbnRPbkJ1eWFibGVzIjoiMCIsInVwZ3JhZGVzIjpbXSwibWlsZXN0b25lcyI6W10sImxhc3RNaWxlc3RvbmUiOm51bGwsImFjaGlldmVtZW50cyI6W10sImNoYWxsZW5nZXMiOnt9LCJncmlkIjp7fSwicHJldlRhYiI6IiJ9LCJ0cmVlLXRhYiI6eyJ1bmxvY2tlZCI6dHJ1ZSwidG90YWwiOiIwIiwiYmVzdCI6IjAiLCJyZXNldFRpbWUiOjY4MzkuMTI0NTA2NTEyNzE3LCJmb3JjZVRvb2x0aXAiOmZhbHNlLCJidXlhYmxlcyI6e30sIm5vUmVzcGVjQ29uZmlybSI6ZmFsc2UsImNsaWNrYWJsZXMiOnt9LCJzcGVudE9uQnV5YWJsZXMiOiIwIiwidXBncmFkZXMiOltdLCJtaWxlc3RvbmVzIjpbXSwibGFzdE1pbGVzdG9uZSI6bnVsbCwiYWNoaWV2ZW1lbnRzIjpbXSwiY2hhbGxlbmdlcyI6e30sImdyaWQiOnt9LCJwcmV2VGFiIjoiIn0sImxpbmUiOnsidW5sb2NrZWQiOnRydWUsInBvaW50cyI6IjAiLCJ0b3RhbCI6IjAiLCJiZXN0IjoiMCIsInJlc2V0VGltZSI6MTIyLjczOTcyNDU5OTA2NTYsImZvcmNlVG9vbHRpcCI6ZmFsc2UsImJ1eWFibGVzIjp7fSwibm9SZXNwZWNDb25maXJtIjpmYWxzZSwiY2xpY2thYmxlcyI6e30sInNwZW50T25CdXlhYmxlcyI6IjAiLCJ1cGdyYWRlcyI6W10sIm1pbGVzdG9uZXMiOltdLCJsYXN0TWlsZXN0b25lIjpudWxsLCJhY2hpZXZlbWVudHMiOltdLCJjaGFsbGVuZ2VzIjp7fSwiZ3JpZCI6e30sInByZXZUYWIiOiIifSwiY2VsbCI6eyJ1bmxvY2tlZCI6dHJ1ZSwicG9pbnRzIjoiNy41NjA5MTAwNTY2ODQ0NDNlNjYiLCJzYyI6IjQuMzMwODIxODE0Njg0MzU4NWU1MCIsIndhaXQiOiIwIiwiZHdhaXQiOiIyMCIsInNjbG9uZyI6IjI0Iiwic2Nsb25nbmVlZCI6IjFlMjQiLCJwYyI6IjMuNTc1Mzc4OTk3MTg5ODIzM2UyOSIsImFjIjoiMy41NzUzNzg5OTcxODk4MjMzZTI5IiwidG90YWwiOiI3LjU2MDkxMDA1NjY4NDQ0M2U2NiIsImJlc3QiOiI3LjU2MDkxMDA1NjY4NDQ0M2U2NiIsInJlc2V0VGltZSI6NDQxLjMyNzIzNjk5MDI2MjUsImZvcmNlVG9vbHRpcCI6ZmFsc2UsImJ1eWFibGVzIjp7fSwibm9SZXNwZWNDb25maXJtIjpmYWxzZSwiY2xpY2thYmxlcyI6eyIxMSI6IiIsIjEyIjoiIiwiMTMiOiIiLCIxNCI6IiJ9LCJzcGVudE9uQnV5YWJsZXMiOiIwIiwidXBncmFkZXMiOltdLCJtaWxlc3RvbmVzIjpbIjAiLCIxIiwiMiIsIjMiXSwibGFzdE1pbGVzdG9uZSI6IjMiLCJhY2hpZXZlbWVudHMiOltdLCJjaGFsbGVuZ2VzIjp7fSwiZ3JpZCI6e30sInByZXZUYWIiOiIifSwiYXRvbSI6eyJ1bmxvY2tlZCI6dHJ1ZSwicG9pbnRzIjoiMi4yMjUxOTMzNTg0MjA0NDQ0ZTkwIiwiSGUzIjoiMS41NjEyMjk3OTIxMDY0MTQ3ZTI5IiwidG90YWwiOiIyLjIyNTE5MzM1ODQyMDQ0NDRlOTAiLCJiZXN0IjoiMi4yMjUxOTMzNTg0MjA0NDQ0ZTkwIiwicmVzZXRUaW1lIjoxMjIuNzM5NzI0NTk5MDY1NiwiZm9yY2VUb29sdGlwIjpmYWxzZSwiYnV5YWJsZXMiOnsiMTEiOiI4NDYifSwibm9SZXNwZWNDb25maXJtIjpmYWxzZSwiY2xpY2thYmxlcyI6e30sInNwZW50T25CdXlhYmxlcyI6IjAiLCJ1cGdyYWRlcyI6WzExLDEyLDEzXSwibWlsZXN0b25lcyI6WyIwIiwiMSIsIjIiXSwibGFzdE1pbGVzdG9uZSI6IjIiLCJhY2hpZXZlbWVudHMiOltdLCJjaGFsbGVuZ2VzIjp7IjExIjoxLCIxMiI6MX0sImdyaWQiOnt9LCJwcmV2VGFiIjoiIiwiYWN0aXZlQ2hhbGxlbmdlIjpudWxsLCJMUCI6IjcuNzU4OTQzNTYyNTg0NDI4ZTc2In0sIm9mZlRpbWUiOnsicmVtYWluIjowLjIxOTQ3NTQwMDkzNDM3OTY3fX0=
        //这个档我一进去就炸
        
        if(inChallenge("atom", 12)){
            player.atom.LP = player.atom.LP.add(player.atom.points.add(1).pow(0.3).times(diff??0))
        }
        if(!inChallenge("atom", 12)){
            player.atom.LP = player.atom.LP.sub(player.atom.LP.times(diff??0).div(100))
        }
    },
    upgrades: {
    //我也经常写不出来升级
    //可以有“分子”，“放射性原子”什么什么的
    //
    11: {
        title: "分子",
        description: "解锁分子购买项",
        cost: new Decimal(10),
        unlocked() { return hasMilestone("atom", 2) }
    },
    12: {
        title: "放射性原子",
        description: "解锁挑战",//还真行（）
        cost: new Decimal(10),
        unlocked() { return hasMilestone("atom", 2) }
    },
    13: {
        title: "微量元素",
        description: "在对面解锁一个点击项",
        cost: new Decimal(150000),
        unlocked() { return hasMilestone("atom", 0) && hasMilestone("cell", 0) }
    }
}//+1+1+1+1+1
    });

