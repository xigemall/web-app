<script setup lang="ts">
import {onMounted, onUnmounted, reactive} from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";
import request from "@/utils/request";

const aMapKey = import.meta.env.VITE_APP_AMAP_KEY
const aMapWebServiceKey = import.meta.env.VITE_APP_AMAP_WEBSERVICE_KEY

const lngLat = reactive<{ lng: number, lat: number }>({lng: 0, lat: 0})

let map: any = null;
window._AMapSecurityConfig = {
    securityJsCode: "c2aa419cd747a13acb0e65171642cc44",
};

type LocationType = {
    status: 0 | 1
    [key: string]: any
    rectangle: string
}
const getLocation = async () => {
    const result: LocationType = await request.get('https://restapi.amap.com/v3/ip', {params: {key: aMapWebServiceKey}});
    if (result.status) {
        const location = result.rectangle.split(';')
        lngLat.lng = Number(location[0].split(',')[0]);
        lngLat.lat = Number(location[0].split(',')[1]);
    }
}


const initAMap = () => {
    AMapLoader.load({
        key: aMapKey, // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: ["AMap.Scale"], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
    })
        .then((AMap) => {
            map = new AMap.Map("container", {
                // 设置地图容器id
                viewMode: "3D", // 是否为3D地图模式
                zoom: 11, // 初始化地图级别
                center: [lngLat.lng, lngLat.lat], // 初始化地图中心点位置
            });


            const traffic = new AMap.TileLayer.Traffic({
                autoRefresh: true, //是否自动刷新，默认为false
                interval: 180, //刷新间隔，默认180s
            });
            map.add(traffic); //通过add方法添加图层
        })
        .catch((e) => {
            console.log(e);
        });
}
onMounted(async () => {
    await getLocation();
    await initAMap();
});

onUnmounted(() => {
    map?.destroy();
});
</script>

<template>
    <div id="container"></div>
</template>

<style scoped lang="less">
#container {
    width: 100%;
    height: 600px;
}
</style>
