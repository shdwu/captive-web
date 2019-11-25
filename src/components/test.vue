<template>
    <div id="app">
        <div class="header">
            我是头部内容
        </div>
        <div id="map" class="csnt-map is-full"></div>
    </div>
</template>

<script>
    import {
        Map,
        shipManager,
    } from '@csnt/map-core';
    import '@csnt/map-core/dist/map-core.min.css';

    export default {
        name: 'apps',
        data() {
            return {
                ready: false,
                map: null,
                shipManager: null, //船舶实例
            };
        },
        mounted() {
            this.setupMap(); //初始化地图及相关组件
            this.map.on('click', this.handleMapClick);
        },


        methods: {

            /**
             * 初始化地图及相关组件
             */
            setupMap() {
                // 初始化地图
                let map = new Map("map", {
                    minZoom: 1,
                    zoom: 3,
                    zoomControl: false,
                    latlngControl: false,
                    tileControl: true,
                    center: [38, 119]
                });
                // 初始化船舶
                this.shipManager = shipManager(map, {
                    useIcon: false,
                    fn: {
                        shipClick: this.shipDataCallback.bind(this),
                    }
                });
                this.map = map;
                this.ready = true;
            },

            /**
             * 点击地图的回调函数
             * @param dat 回调内容
             */
            handleMapClick(dat) {
                console.log(dat)
            },

            /**
             * 点击船舶回调函数
             * @param dat 回调内容 船舶mmsi
             */
            shipDataCallback(dat) {
                console.log(dat)
            },

            /**
             * 显示船舶历史航迹
             * @param data 船舶航迹数据
             * @param mmsi 船舶mmsi
             */
            handleShipTrack(data, mmsi, obj) {
                //   let obj = {
                //       linkToShip: true  true 连接到当前船位 false不连接到当前船位
                //   }
                let array = data.map(it => {
                    it.lng = it.lon;
                    return it;
                });
                this.shipManager.hideTrack();
                this.shipManager.showTrack(mmsi, array, obj);
            },

            /**
             * 根据船舶类型获取船舶颜色
             * @param shipType 船舶类型
             */
            getShipColor(shipType) {
                const groupColor = {
                    '客轮': '#fa42fc',
                    '集装箱': '#4af854',
                    '油轮': '#f2454d',
                    '干散货': '#f5f859',
                    '特种船': '#404cfb'
                };
                let color = groupColor[shipType];
                if (color) {
                    return color
                } else {
                    return '#6289ff'
                }
            },

        }
    };
</script>

<style>
    .header {
        position: fixed;
        left: 0;
        top: 0;
        z-index: 999;
        right: 0;
        min-width: 12rem;
        background-color: antiquewhite;
    }


    #map {
        width: 100%;
        height: 100%;
    }

    #app {
        height: 100%;
    }
</style>