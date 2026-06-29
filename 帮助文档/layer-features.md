# Layer Features

This is a more comprehensive list of established features to add to layers. You can add more freely, if you want to have other functions or values associated with your layer. These have special functionality, though.

You can make almost any value dynamic by using a function in its place, including all display strings and styling/color features.

## Layer Definition features

- layer: **assigned automagically**. It's the same value as the name of this layer, so you can do `player[this.layer].points` or similar to access the saved value. It makes copying code to new layers easier. It is also assigned to all upgrades and buyables and such.

- name: **optional**. used in reset confirmations (and the default infobox title). If absent, it just uses the layer's id.

- startData(): A function to return the default save data for this layer. Add any variables you have to it. Make sure to use `Decimal` values rather than normal numbers.

    Standard values:
        - Required:
            - unlocked: a bool determining if this layer is unlocked or not
            - points: a Decimal, the main currency for the layer
        - Optional:
            - total: A Decimal, tracks total amount of main prestige currency. Always tracked, but only shown if you add it here.
            - best: A Decimal, tracks highest amount of main prestige currency. Always tracked, but only shown if you add it here.
            - unlockOrder: used to keep track of relevant layers unlocked before this one.
            - resetTime: A number, time since this layer was last prestiged (or reset by another layer)

- color: A color associated with this layer, used in many places. (A string in hex format with a #)

- row: The row of the layer, starting at 0. This affects where the node appears on the standard tree, and which resets affect the layer.

    Using "side" instead of a number will cause the layer to appear off to the side as a smaller node (useful for achievements and statistics). Side layers are not affected by resets unless you add a doReset to them.

- displayRow: **OVERRIDE** Changes where the layer node appears without changing where it is in the reset order.

- resource: Name of the main currency you gain by resetting on this layer.

- effect(): **optional**. A function that calculates and returns the current values of any bonuses inherent to the main currency. Can return a value or an object containing multiple values. *You will also have to implement the effect where it is applied.*

- effectDescription: **optional**. A function that returns a description of this effect. If the text stays constant, it can just be a string.

- layerShown(): **optional**, A function returning a bool which determines if this layer's node should be visible on the tree. It can also return "ghost", which will hide the layer, but its node will still take up space in the tree.
    Defaults to true.

- hotkeys: **optional**. An array containing information on any hotkeys associated with this layer:

    ```js
    hotkeys: [
        {
            key: "p", // What the hotkey button is. Use uppercase if it's combined with shift, or "ctrl+x" for holding down ctrl.
            description: "p: reset your points for prestige points", // The description of the hotkey that is displayed in the game's How To Play tab
            onPress() { if (player.p.unlocked) doReset("p") },
            unlocked() {return hasMilestone('p', 3)} // Determines if you can use the hotkey, optional
        }
    ]
    ```

- style: **optional**. a "CSS object" where the keys are CSS attributes, containing any CSS that should affect this layer's entire tab.

- tabFormat: **optional**. use this if you want to add extra things to your tab or change the layout. [See here for more info.](custom-tab-layouts.md)

- midsection: **optional**, an alternative to `tabFormat`, which is inserted in between Milestones and Buyables in the standard tab layout. (cannot do subtabs)

## Big features (all optional)

- upgrades: A set of one-time purchases which can have unique upgrade conditions, currency costs, and bonuses. [See here for more info.](upgrades.md)

- milestones: A list of bonuses gained upon reaching certain thresholds of a resource. Often used for automation/QOL. [See here for more info.](milestones.md)

- challenges: The player can enter challenges, which make the game harder. If they reach a goal and beat the challenge, they recieve a bonus. [See here for more info.](challenges.md)

- buyables: Effectively upgrades that can be bought multiple times, and are optionally respeccable. Many uses. [See here for more info.](buyables.md)

- clickables: Extremely versatile and generalized buttons which can only be clicked sometimes. [See here for more info.](clickables.md)

- microtabs: An area that functions like a set of subtabs, with buttons at the top changing the content within. (Advanced) [See here for more info.](subtabs-and-microtabs.md)

- bars: Display some information as a progress bar, gague, or similar. They are highly customizable, and can be vertical as well. [See here for more info.](bars.md)

- achievements: Kind of like milestones, but with a different display style and some other differences. Extra features are on the way at a later date! [See here for more info.](achievements.md)

- achievementPopups, milestonePopups: **optional**, If false, disables popup message when you get the achievement/milestone. True by default.

- infoboxes: Displays some text in a box that can be shown or hidden. [See here for more info.](infoboxes.md)

- grid: A grid of buttons that behave the same, but have their own data.[See here for more info.](grids.md)

## Prestige formula features

- type: **optional**. Determines which prestige formula you use. Defaults to "none".

    - "normal": The amount of currency you gain is independent of its current amount (like Prestige). The formula before bonuses is based on `baseResource^exponent`
    - "static": The cost is dependent on your total after reset. The formula before bonuses is based on `base^(x^exponent)`
    - "custom": You can define everything, from the calculations to the text on the button, yourself. (See more at the bottom)
    - "none": This layer does not prestige, and therefore does not need any of the other features in this section.

- baseResource: The name of the resource that determines how much of the main currency you gain on reset.

- baseAmount(): A function that gets the current value of the base resource.

- requires: A Decimal, the amount of the base needed to gain 1 of the prestige currency. Also the amount required to unlock the layer. You can instead make this a function, to make it harder if another layer was unlocked first (based on unlockOrder).

- exponent: Used as described above.

- base: **sometimes required**. required for "static" layers, used as described above. If absent, defaults to 2. Must be greater than 1.

- roundUpCost: **optional**. a bool, which is true if the resource cost needs to be rounded up. (use if the base resource is a "static" currency.)

- gainMult(), gainExp(): **optional**. For normal layers, these functions calculate the multiplier and exponent on resource gain from upgrades and boosts and such. Plug in most bonuses here.
    For static layers, they instead multiply and roots the cost of the resource. (So to make a boost you want to make gainMult smaller and gainExp larger.)

- directMult(): **optional**. Directly multiplies the resource gain, after exponents and softcaps. For static layers, actually multiplies resource gain instead of reducing the cost.

- softcap, softcapPower: **optional**. For normal layers, gain beyond [softcap] points is put to the [softcapPower]th power
    Default for softcap is e1e7, and for power is 0.5.

## Other prestige-related features

- canBuyMax(): **sometimes required**. required for static layers, function used to determine if buying max is permitted.

- onPrestige(gain): **optional**. A function that triggers when this layer prestiges, just before you gain the currency.  Can be used to have secondary resource gain on prestige, or to recalculate things or whatnot.

- resetDescription: **optional**. Use this to replace "Reset for " on the Prestige button with something else.

- prestigeButtonText(): **sometimes required**. Use this to make the entirety of the text a Prestige button contains. Only required for custom layers, but usable by all types.

- passiveGeneration(): **optional**, returns a regular number. You automatically generate your gain times this number every second (does nothing if absent)
        This is good for automating Normal layers.

- autoPrestige(): **optional**, returns a boolean, if true, the layer will always automatically do a prestige if it can.
        This is good for automating Static layers.

## Tree/node features

- symbol: **optional**. The text that appears on this layer's node. Default is the layer id with the first letter capitalized.

- image: **override**. The url (local or global) of an image that goes on the node. (Overrides symbol)

- position: **optional**. Determines the horizontal position of the layer in its row in a standard tree. By default, it uses the layer id, and layers are sorted in alphabetical order.

- branches: **optional**. An array of layer/node ids. On a tree, a line will appear from this layer to all of the layers in the list. Alternatively, an entry in the array can be a 2-element array consisting of the layer id and a color value. The color value can either be a string with a hex color code, or a number from 1-3 (theme-affected colors). A third element in the array optionally specifies line width.

- nodeStyle: **optional**. A CSS object, where the keys are CSS attributes, which styles this layer's node on the tree.

- tooltip() / tooltipLocked(): **optional**. Functions that return text, which is the tooltip for the node when the layer is unlocked or locked, respectively. By default the tooltips behave the same as in the original Prestige Tree.
    If the value is "", the tooltip will be disabled.

- marked: **optional** Adds a mark to the corner of the node. If it's "true" it will be a star, but it can also be an image URL.

## Other features

- doReset(resettingLayer): **optional**. Is triggered when a layer on a row greater than or equal to this one does a reset. The default behavior is to reset everything on the row, but only if it was triggered by a layer in a higher row. `doReset` is always called for side layers, but for these the default behavior is to reset nothing.
                
    If you want to keep things, determine what to keep based on `resettingLayer`, `milestones`, and such, then call `layerDataReset(layer, keep)`, where `layer` is this layer, and `keep` is an array of the names of things to keep. It can include things like "points", "best", "total" (for this layer's prestige currency), "upgrades",  any unique variables like "generatorPower", etc. If you want to only keep specific upgrades or something like that, save them in a separate variable, then call `layerDataReset`, and then set `player[this.layer].upgrades` to the saved upgrades.

- update(diff): **optional**. This function is called every game tick. Use it for any passive resource production or time-based things. `diff` is the time since the last tick. 

- autoUpgrade: **optional**, a boolean value, if true, the game will attempt to buy this layer's upgrades every tick. Defaults to false.

- automate(): **optional**. This function is called every game tick, after production. Use it to activate automation things that aren't otherwise supported. 

- resetsNothing: **optional**. Returns true if this layer shouldn't trigger any resets when you prestige.

- increaseUnlockOrder: **optional**. An array of layer ids. When this layer is unlocked for the first time, the `unlockOrder` value for any not-yet-unlocked layers in this list increases. This can be used to make them harder to unlock.

- shouldNotify: **optional**. A function to return true if this layer should be highlighted in the tree. The layer will automatically be highlighted if you can buy an upgrade whether you have this or not.

- glowColor: **optional**. The color that this layer will be highlighted if it should notify. The default is red. You can use this if you want several different notification types!

- componentStyles: **optional**. An object that contains a set of functions returning CSS objects. Each of these will be applied to any components on the layer with the type of its id. Example:

```js
componentStyles: {
    "challenge"() { return {'height': '200px'} },
    "prestige-button"() { return {'color': '#AA66AA'} }
}
```

- leftTab: **optional**, if true, this layer will use the left tab instead of the right tab.

- previousTab: **optional**, a layer's id. If a layer has a previousTab, the layer will always have a back arrow and pressing the back arrow on this layer will take you to the layer with this id. 

- deactivated: **optional**, if this is true, hasUpgrade, hasChallenge, hasAchievement, and hasMilestone will return false for things in the layer, and you will be unable to buy or click things on the layer. You will have to disable effects of buyables, the innate layer effect, and possibly other things yourself.

## Custom Prestige type  
(All of these can also be used by other prestige types)

- getResetGain(): **mostly for custom prestige type**. Returns how many points you should get if you reset now. You can call `getResetGain(this.layer, useType = "static")` or similar to calculate what your gain would be under another prestige type (provided you have all of the required features in the layer).

- getNextAt(canMax=false): **mostly for custom prestige type**. Returns how many of the base currency you need to get to the next point. `canMax` is an optional variable used with Static-ish layers to differentiate between if it's looking for the first point you can reset at, or the requirement for any gain at all (Supporting both is good). You can also call `getNextAt(this.layer, canMax=false, useType = "static")` or similar to calculate what your next at would be under another prestige type (provided you have all of the required features in the layer).

- canReset(): **mostly for custom prestige type**. Return true only if you have the resources required to do a prestige here.

- prestigeNotify(): **mostly for custom prestige types**, returns true if this layer should be subtly highlighted to indicate you
        can prestige for a meaningful gain.
        
好的，这是对 "Layer Features" 文档的中文翻译，保留了原始的代码示例和结构，同时提供了详细的中文解释：

---

# 层（Layer）功能特性

这是一个更全面的已确立功能列表，可用于添加到层（Layer）中。如果您想为层关联其他功能或值，也可以自由添加。不过这些功能具有特殊的作用。

您可以通过用函数替换任何值，使几乎所有值都动态化，包括所有显示字符串和样式/颜色特性。

## 层定义特性

- **layer**: **自动赋值**。其值与此层的名称相同，因此您可以使用 `player[this.layer].points` 或类似方式访问保存的值。这使得将代码复制到新层变得更加容易。它也会被分配给所有升级项、可购买项等。

- **name**: **可选**。用于重置确认（以及默认信息框标题）。如果省略，则直接使用层的 id。

- **startData()**: 返回此层默认保存数据的函数。将您拥有的任何变量添加到其中。请确保使用 `Decimal` 值而非普通数字。

    标准值：
        - 必需:
            - **unlocked**: 一个布尔值，决定此层是否已解锁
            - **points**: 一个 Decimal 值，是此层的主要货币
        - 可选:
            - **total**: 一个 Decimal 值，跟踪主要声望货币的总数量。始终被跟踪，但仅在此处添加时才会显示。
            - **best**: 一个 Decimal 值，跟踪主要声望货币的最高数量。始终被跟踪，但仅在此处添加时才会显示。
            - **unlockOrder**: 用于跟踪在此层之前解锁的相关层。
            - **resetTime**: 一个数字，表示自上次声望（或被其他层重置）以来经过的时间。

- **color**: 与此层关联的颜色，在多处使用。（十六进制格式的字符串，带 #）

- **row**: 层的行号，从 0 开始。这影响节点在标准树中的位置，以及哪些重置会影响该层。

    使用 "side" 替代数字会使层作为较小的节点出现在侧面（对成就和统计数据很有用）。除非您添加 doReset，否则侧边层不受重置影响。

- **displayRow**: **覆盖** 更改层节点的显示位置，而不改变其在重置顺序中的位置。

- **resource**: 通过在此层重置获得的主要货币的名称。

- **effect()**: **可选**。计算并返回主要货币固有任何当前加成值的函数。可以返回一个值或包含多个值的对象。*您还必须在应用处实现该效果。*

- **effectDescription**: **可选**。返回此效果描述的函数。如果文本保持不变，它可以只是一个字符串。

- **layerShown()**: **可选**。返回布尔值的函数，决定此层的节点是否应该在树中可见。它也可以返回 "ghost"，这将隐藏该层，但它的节点仍会在树中占据空间。
    默认为 true。

- **hotkeys**: **可选**。包含与此层关联的任何快捷键信息的数组：

    ```js
    hotkeys: [
        {
            key: "p", // 快捷键按钮。如果与 Shift 组合使用，请使用大写，或使用 "ctrl+x" 表示按住 ctrl。
            description: "p: 重置您的点数以获得声望点数", // 在游戏的"如何游玩"选项卡中显示的快捷键描述
            onPress() { if (player.p.unlocked) doReset("p") },
            unlocked() {return hasMilestone('p', 3)} // 决定是否可以使用快捷键，可选
        }
    ]
    ```

- **style**: **可选**。一个"CSS对象"，其键是CSS属性，包含应影响此层整个标签页的任何CSS。

- **tabFormat**: **可选**。如果您想在标签页中添加额外内容或更改布局，请使用此选项。[更多信息请参见这里。](custom-tab-layouts.md)

- **midsection**: **可选**，是 `tabFormat` 的替代方案，在标准标签页布局中插入在里程碑（Milestones）和可购买项（Buyables）之间。（不支持子标签页）

## 主要功能（全部可选）

- **upgrades**: 一次性购买项目集，可以有独特的升级条件、货币成本和加成。[更多信息请参见这里。](upgrades.md)

- **milestones**: 达到特定资源阈值时获得的奖励列表。常用于自动化/生活质量改进。[更多信息请参见这里。](milestones.md)

- **challenges**: 玩家可以进入挑战，这会使游戏变得更难。如果他们达到目标并完成挑战，将获得奖励。[更多信息请参见这里。](challenges.md)

- **buyables**: 实质上是可多次购买的升级，并且可以选择性地重置。有多种用途。[更多信息请参见这里。](buyables.md)

- **clickables**: 极其通用且灵活的按钮，但只能在特定时间点击。[更多信息请参见这里。](clickables.md)

- **microtabs**: 一个功能类似于子标签页的区域，顶部的按钮会改变其中的内容。（高级）[更多信息请参见这里。](subtabs-and-microtabs.md)

- **bars**: 将一些信息显示为进度条、仪表盘或类似形式。它们高度可定制，也可以是垂直的。[更多信息请参见这里。](bars.md)

- **achievements**: 类似于里程碑，但显示样式和一些其他方面有所不同。更多功能正在计划中！[更多信息请参见这里。](achievements.md)

- **achievementPopups**, **milestonePopups**: **可选**，如果为 false，则在获得成就/里程碑时禁用弹出消息。默认为 true。

- **infoboxes**: 在一个可显示或隐藏的框中显示一些文本。[更多信息请参见这里。](infoboxes.md)

- **grid**: 一组行为相同但各自拥有数据的按钮。[更多信息请参见这里。](grids.md)

## 声望公式特性

- **type**: **可选**。确定您使用的声望公式。默认为 "none"。

    - **"normal"**: 您获得的货币数量与其当前数量无关（如 Prestige）。加成前的公式基于 `baseResource^exponent`
    - **"static"**: 成本取决于您重置后的总数。加成前的公式基于 `base^(x^exponent)`
    - **"custom"**: 您可以自己定义一切，从计算到按钮上的文本。（详见底部）
    - **"none"**: 此层不进行声望重置，因此不需要本部分中的任何其他功能。

- **baseResource**: 决定重置时获得多少主要资源的资源名称。

- **baseAmount()**: 获取基础资源当前值的函数。

- **requires**: 一个 Decimal 值，获得 1 个声望货币所需的基础资源量。也是解锁该层所需的量。您可以将其设为函数，使另一个层先解锁时变得更难（基于 unlockOrder）。

- **exponent**: 如上所述使用。

- **base**: **有时必需**。对于 "static" 层是必需的，如上所述使用。如果缺失，默认为 2。必须大于 1。

- **roundUpCost**: **可选**。一个布尔值，如果为 true，则资源成本需要向上取整。（如果基础资源是"静态"货币，请使用此选项。）

- **gainMult()**, **gainExp()**: **可选**。对于普通层，这些函数计算来自升级和加成等的资源获取的乘数和指数。将大多数加成放在这里。
    对于静态层，它们反而会乘以和开方资源成本。（因此要制作加成，您希望使 gainMult 更小，gainExp 更大。）

- **directMult()**: **可选**。直接乘以资源获取，在指数和软上限之后。对于静态层，实际上是乘以资源获取，而不是减少成本。

- **softcap**, **softcapPower**: **可选**。对于普通层，超过 [softcap] 点的获取会被提高到 [softcapPower] 次幂
    softcap 的默认值是 e1e7，power 的默认值是 0.5。

## 其他声望相关特性

- **canBuyMax()**: **有时必需**。对于静态层是必需的，用于确定是否允许购买最大值。

- **onPrestige(gain)**: **可选**。当此层进行声望重置时触发的函数，在您获得货币之前。可用于在声望重置时获得二级资源增益，或重新计算其他内容等。

- **resetDescription**: **可选**。用于替换声望按钮上的 "Reset for "。

- **prestigeButtonText()**: **有时必需**。用于使声望按钮包含的文本完全由您定义。仅对自定义层是必需的，但所有类型都可以使用。

- **passiveGeneration()**: **可选**，返回一个普通数字。您每秒自动生成获取量乘以此数值（如果不存在则无效果）
        这对于自动化普通层很有用。

- **autoPrestige()**: **可选**，返回一个布尔值，如果为 true，则层将始终自动进行声望重置（如果可能）。
        这对于自动化静态层很有用。

## 树/节点特性

- **symbol**: **可选**。出现在此层节点上的文本。默认是首字母大写的层 id。

- **image**: **覆盖**。位于节点上的图片的 URL（本地或全局）。（覆盖 symbol）

- **position**: **可选**。确定层在标准树中其行内的水平位置。默认情况下，它使用层 id，并按字母顺序对层进行排序。

- **branches**: **可选**。层/节点 id 的数组。在树上，一条线将从此层延伸到列表中的所有层。或者，数组中的一个条目可以是一个包含层 id 和颜色值的二维数组。颜色值可以是带有十六进制颜色代码的字符串，也可以是 1-3 的数字（受主题影响的颜色）。数组中的第三个元素可选地指定线宽。

- **nodeStyle**: **可选**。一个 CSS 对象，其键是 CSS 属性，用于设置此层在树上的节点样式。

- **tooltip()** / **tooltipLocked()**: **可选**。返回文本的函数，分别是层解锁和锁定时节点的工具提示。默认情况下，工具提示的行为与原始声望树中的相同。
    如果值为 ""，则禁用工具提示。

- **marked**: **可选** 在节点角落添加一个标记。如果为 "true"，它将是一个星形，但它也可以是图片 URL。

## 其他特性

- **doReset(resettingLayer)**: **可选**。当一个行号大于或等于此层的层进行重置时触发。默认行为是重置该行上的所有内容，但前提是它是由更高行的层触发的。`doReset` 总是被调用侧边层，但对于这些层，默认行为是不重置任何内容。
                
    如果您想保留某些内容，根据 `resettingLayer`、`milestones` �确定保留什么，然后调用 `layerDataReset(layer, keep)`，其中 `layer` 是此层，`keep` 是要保留的内容名称数组。它可以包括 "points"、"best"、"total"（对于此层的声望货币）、"upgrades" 以及任何独特的变量，如 "generatorPower" 等。如果您只想保留特定的升级或类似内容，请将它们保存在单独的变量中，然后调用 `layerDataReset`，然后将 `player[this.layer].upgrades` 设置为保存的升级。

- **update(diff)**: **可选**。此函数在每个游戏刻度（tick）被调用。用于任何被动资源生产或基于时间的事物。`diff` 是自上次刻度以来的时间。

- **autoUpgrade**: **可选**，一个布尔值，如果为 true，游戏将尝试在每个刻度购买此层的升级。默认为 false。

- **automate()**: **可选**。此函数在每个游戏刻度被调用，在生产之后。用于激活其他方式不支持的自动化功能。

- **resetsNothing**: **可选**。如果此层在声望重置时不应该触发任何重置，则返回 true。

- **increaseUnlockOrder**: **可选**。层 id 的数组。当此层首次解锁时，此列表中任何尚未解锁的层的 `unlockOrder` 值会增加。这可以用于使它们更难解锁。

- **shouldNotify**: **可选**。一个函数，如果此层应该在树中高亮显示，则返回 true。如果您可以购买升级，无论您是否有此功能，层都会自动高亮显示。

- **glowColor**: **可选**。如果应该通知，此层将高亮显示的颜色。默认为红色。如果您想要几种不同的通知类型，可以使用这个！

- **componentStyles**: **可选**。一个包含返回 CSS 对象的函数集合的对象。这些将应用于层上类型与其 id 匹配的任何组件。示例：

```js
componentStyles: {
    "challenge"() { return {'height': '200px'} },
    "prestige-button"() { return {'color': '#AA66AA'} }
}
```

- **leftTab**: **可选**，如果为 true，此层将使用左侧标签页而不是右侧标签页。

- **previousTab**: **可选**，一个层的 id。如果一个层有 previousTab，则该层将始终有一个返回箭头，按下此层的返回箭头将带您到具有此 id 的层。

- **deactivated**: **可选**，如果为 true，则 hasUpgrade、hasChallenge、hasAchievement 和 hasMilestone 将对此层中的内容返回 false，您将无法在该层上购买或点击内容。您必须自己禁用可购买项的效果、固有层效果以及可能的其他内容。

## 自定义声望类型  
（这些也可以被其他声望类型使用）

- **getResetGain()**: **主要用于自定义声望类型**。返回如果现在重置应该获得多少点。您可以调用 `getResetGain(this.layer, useType = "static")` 或类似方式来计算在另一种声望类型下您的收益是多少（前提是您在该层中拥有所有必需的功能）。

- **getNextAt(canMax=false)**: **主要用于自定义声望类型**。返回获得下一个点所需多少基础资源。`canMax` 是一个可选变量，与类静态层一起使用，以区分它是查找您可以重置的第一个点，还是任何增益的总需求（支持两者都很好）。您也可以调用 `getNextAt(this.layer, canMax=false, useType = "static")` 或类似方式来计算在另一种声望类型下您的下一个点是多少（前提是您在该层中拥有所有必需的功能）。

- **canReset()**: **主要用于自定义声望类型**。仅当您拥有在此处进行声望重置所需的资源时返回 true。

- **prestigeNotify()**: **主要用于自定义声望类型**，如果此层应该被微妙地高亮显示以表示您可以获得有意义的增益，则返回 true。