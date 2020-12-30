<template>
    <div class="demo-wrapper">
        <p class="tip">
            默认开启树形结构,只需要row含有子节点数组，默认为 row 的 children 字段， 可通过 childrenKey 修改,
        </p>
        <p>设置treeNodeKey 指定展开箭头所在的列</p>
        <ele-rw-table height="auto" :max-height="500" ref="table" row-key="name" :tree-node-key="'class'"
                      :table-data="tableData"
                      :table-cols="tableCols"/>
        <code-panel>
            <highlightjs language='javascript' :code="code1"/>
        </code-panel>
    </div>
</template>

<script type="text/jsx">
const col = [
    {key: 'class', label: '类型', width: 100},
    {key: 'name', label: '名字', width: 200},
    {key: 'rate', label: '胜率', width: 120, renderHeader: h => '胜率(编的)'},
];
const code1 = `
            <template>
                <ele-rw-table height="auto" :max-height="500"  ref="table" row-key="name" :tree-node-key="'class'"
                      :table-data="tableData"
                      :table-cols="tableCols"/>
            </template>
            <script>
                const fs = \`1.九尾妖狐 　　2.殇之木乃伊 　　3.冰晶凤凰 　　4.黑暗之女 　　5.铸星龙王 　　6.沙漠皇帝 　　7.星界游神 　　8.复仇焰魂 　　9.魔蛇之拥 　　10.虚空恐惧 　　11.皎月女神 　　12.蜘蛛女皇 　　13.寡妇制造者 　　14.探险家 　　15.末日使者 　　16.哨兵之殇 　　17.酒桶 　　18.大发明家 　　19.风暴之怒 　　20.天启者 　　21.死亡颂唱者 　　22.虚空行者 　　23.不祥之刃 　　24.狂暴之心 　　25.深渊巨口 　　26.诡术妖姬 　　27.冰霜女巫 　　28.仙灵女巫 　　29.光辉女郎 　　30.虚空先知 　　31.扭曲树精 　　32.堕落天使 　　33.唤潮鲛姬 　　34.发条魔灵 　　35.机械公敌 　　36.符文法师 　　37.琴瑟仙女 　　38.众星之子 　　39.策士统领 　　40.暗黑元首 　　41.岩雀 　　42.卡牌大师 　　43.惩戒之箭 　　44.邪恶小法师 　　45.虚空之眼 　　46.机械先驱 　　47.猩红收割者 　　48.远古巫灵 　　49.掘墓者 　　50.爆破鬼才 　　51.时光守护者 　　52.荆棘之兴\`
                const tk = \`1.暗裔剑魔 　　2.牛头酋长 　　3.殇之木乃伊 　　4.蒸汽机器人 　　5.弗雷尔卓德之心 　　6.虚空恐惧 　　7.诺克萨斯之手 　　8.祖安狂人 　　9.哨兵之殇 　　10.德玛西亚之力 　　11.迷失之牙 　　12.战争之影 　　13.海兽祭司 　　14.德玛西亚皇子 　　15.曙光女神 　　16.熔岩巨兽 　　17.扭曲树精 　　18.齐天大圣 　　19.沙漠死神 　　20.深海泰坦 　　21.狂战士 　　22.圣锤之毅 　　23.披甲龙龟 　　24.荒漠屠夫 　　25.凛冬之怒 　　26.暮光之眼 　　27.龙血武姬 　　28.炼金术士 　　29.亡灵战神 　　30.水晶先锋 　　31.河流之王 　　32.巨魔之王 　　33.兽灵行者 　　34.猩红收割者 　　35.雷霆咆哮 　　36.嗜血猎手 　　37.生化魔人\`
                const adc = \`1.寒冰射手 　　2.沙漠皇帝 　　3.皮城女警 　　4.英勇投弹手 　　5.荣耀行刑官 　　6.探险家 　　7.法外狂徒 　　8.未来守护者 　　9.戏命师 　　10.暴走萝莉 　　11.复仇之矛 　　12.狂暴之心 　　13.永猎双子 　　14.深渊巨口 　　15.圣枪游侠 　　16.赏金猎人 　　17.德玛西亚之翼 　　18.战争女神 　　19.迅捷斥候 　　20.麦林炮手 　　21.瘟疫之源 　　22.首领之傲 　　23.惩戒之箭 　　24.暗夜猎手\`
                const fz = \`1.牛头酋长 　　2.冰晶凤凰 　　3.寒冰射手 　　4.星界游神 　　5.弗雷尔卓德之心 　　6.末日使者 　　7.大发明家 　　8.风暴之怒 　　9.天启者 　　10.审判天使 　　11.曙光女神 　　12.仙灵女巫 　　13.光辉女郎 　　14.堕落天使 　　15.唤潮鲛姬 　　16.雪人骑士 　　17.发条魔灵 　　18.琴瑟仙女 　　19.众星之子 　　20.暗黑元首 　　21.河流之王 　　22.岩雀 　　23.瓦洛兰之盾 　　24.魂锁典狱长 　　25.时光守护者 　　26.荆棘之兴\`

                const _data = {
                    '法师': fs.split(' ').filter(Boolean).map(i => i.split(".")[1]),
                    '坦克': tk.split(' ').filter(Boolean).map(i => i.split(".")[1]),
                    '射手': adc.split(' ').filter(Boolean).map(i => i.split(".")[1]),
                    '辅组': fz.split(' ').filter(Boolean).map(i => i.split(".")[1]),
                }
                 export default {
                     data(){
                         return {
                             cols: const col = [
                                 {key: 'class', label: '类型', width: 100},
                                 {key: 'name', label: '名字', width: 200},
                                 {key: 'rate', label: '胜率', width: 120,renderHeader:h=> '胜率(编的)'},
                             ],
                             tableData: Object.keys(_data).map(key => {
                                return {
                                    class: key,
                                    children: _data[key].map(item => {
                                        return {
                                            class: key,
                                            name: item,
                                            rate: (100 * Math.random()).toFixed(2) + '%'
                                        }
                                    })
                                }
                            })
                         }
                     },
                 }
            <\/script>`;
const fs = `1.九尾妖狐 　　2.殇之木乃伊 　　3.冰晶凤凰 　　4.黑暗之女 　　5.铸星龙王 　　6.沙漠皇帝 　　7.星界游神 　　8.复仇焰魂 　　9.魔蛇之拥 　　10.虚空恐惧 　　11.皎月女神 　　12.蜘蛛女皇 　　13.寡妇制造者 　　14.探险家 　　15.末日使者 　　16.哨兵之殇 　　17.酒桶 　　18.大发明家 　　19.风暴之怒 　　20.天启者 　　21.死亡颂唱者 　　22.虚空行者 　　23.不祥之刃 　　24.狂暴之心 　　25.深渊巨口 　　26.诡术妖姬 　　27.冰霜女巫 　　28.仙灵女巫 　　29.光辉女郎 　　30.虚空先知 　　31.扭曲树精 　　32.堕落天使 　　33.唤潮鲛姬 　　34.发条魔灵 　　35.机械公敌 　　36.符文法师 　　37.琴瑟仙女 　　38.众星之子 　　39.策士统领 　　40.暗黑元首 　　41.岩雀 　　42.卡牌大师 　　43.惩戒之箭 　　44.邪恶小法师 　　45.虚空之眼 　　46.机械先驱 　　47.猩红收割者 　　48.远古巫灵 　　49.掘墓者 　　50.爆破鬼才 　　51.时光守护者 　　52.荆棘之兴`
const tk = `1.暗裔剑魔 　　2.牛头酋长 　　3.殇之木乃伊 　　4.蒸汽机器人 　　5.弗雷尔卓德之心 　　6.虚空恐惧 　　7.诺克萨斯之手 　　8.祖安狂人 　　9.哨兵之殇 　　10.德玛西亚之力 　　11.迷失之牙 　　12.战争之影 　　13.海兽祭司 　　14.德玛西亚皇子 　　15.曙光女神 　　16.熔岩巨兽 　　17.扭曲树精 　　18.齐天大圣 　　19.沙漠死神 　　20.深海泰坦 　　21.狂战士 　　22.圣锤之毅 　　23.披甲龙龟 　　24.荒漠屠夫 　　25.凛冬之怒 　　26.暮光之眼 　　27.龙血武姬 　　28.炼金术士 　　29.亡灵战神 　　30.水晶先锋 　　31.河流之王 　　32.巨魔之王 　　33.兽灵行者 　　34.猩红收割者 　　35.雷霆咆哮 　　36.嗜血猎手 　　37.生化魔人`
const adc = `1.寒冰射手 　　2.沙漠皇帝 　　3.皮城女警 　　4.英勇投弹手 　　5.荣耀行刑官 　　6.探险家 　　7.法外狂徒 　　8.未来守护者 　　9.戏命师 　　10.暴走萝莉 　　11.复仇之矛 　　12.狂暴之心 　　13.永猎双子 　　14.深渊巨口 　　15.圣枪游侠 　　16.赏金猎人 　　17.德玛西亚之翼 　　18.战争女神 　　19.迅捷斥候 　　20.麦林炮手 　　21.瘟疫之源 　　22.首领之傲 　　23.惩戒之箭 　　24.暗夜猎手`
const fz = `1.牛头酋长 　　2.冰晶凤凰 　　3.寒冰射手 　　4.星界游神 　　5.弗雷尔卓德之心 　　6.末日使者 　　7.大发明家 　　8.风暴之怒 　　9.天启者 　　10.审判天使 　　11.曙光女神 　　12.仙灵女巫 　　13.光辉女郎 　　14.堕落天使 　　15.唤潮鲛姬 　　16.雪人骑士 　　17.发条魔灵 　　18.琴瑟仙女 　　19.众星之子 　　20.暗黑元首 　　21.河流之王 　　22.岩雀 　　23.瓦洛兰之盾 　　24.魂锁典狱长 　　25.时光守护者 　　26.荆棘之兴`

const _data = {
    '法师': fs.split(' ').filter(Boolean).map(i => i.split(".")[1]),
    '坦克': tk.split(' ').filter(Boolean).map(i => i.split(".")[1]),
    '射手': adc.split(' ').filter(Boolean).map(i => i.split(".")[1]),
    '辅组': fz.split(' ').filter(Boolean).map(i => i.split(".")[1]),
}
export default {
    name: "tree-expand",
    data() {
        return {
            tableCols: col,
            tableData: Object.keys(_data).map(key => {
                return {
                    class: key,
                    children: _data[key].map(item => {
                        return {
                            class: key,
                            name: item,
                            rate: (100 * Math.random()).toFixed(2) + '%'
                        }
                    })
                }
            }),
            code1: code1,
        }
    },
    methods: {}
}
</script>
