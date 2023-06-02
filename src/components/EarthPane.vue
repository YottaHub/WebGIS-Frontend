<template>
  <div id="container" class="box">


    <div id="head">
      <div id="head_tile"><p id="title_param" style="color: antiquewhite">城市群夜光格局模拟系统</p></div>
      <div id="head_button1" class="head_button">
        <el-button round @click="showBasicControl" style="position: absolute; left: 550px;top: 15px">基础地图操作
        </el-button>
      </div>
      <div id="head_button2" class="head_button">
        <el-button round @click="analyzeBtnShow" style="position: absolute; left: 750px; top: 15px">城市群分析模块
        </el-button>
        <el-button round @click="protectAreaShow" style="position: absolute; left: 950px; top: 18px">保护区夜间灯光监测
        </el-button>
      </div>

    </div>
    <div id="SizeAnalyse" v-show="analyzeVisible">
      规模分析
      <el-select v-model="value" placeholder="长江三角洲" style="width:150px; margin-top: 30px"
                 @change="selectedCityChanged">
        <el-option
            v-for="item in citiesOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="value" placeholder="2015年" style="width:150px; " @change="selectedYearChanged">
        <el-option
            v-for="item in yearOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>

      <el-button type="primary" style="margin-top: 20px;margin-right: 10px" @click="sizeAnalyse" id="sizeAnalyse">规模分析
      </el-button>
      <el-button type="primary" style="margin-top: 20px;" @click="sizeAnalyseShow" id="sizeAnalyseShow">查看分析结果
      </el-button>
    </div>
    <div id="structAnalyse" v-show="analyzeVisible">
      结构分析
      <el-select v-model="value" placeholder="长江三角洲" style="width:150px; margin-top: 30px"
                 @change="selectedCityChanged">
        <el-option
            v-for="item in citiesOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="value" placeholder="2015年" style="width:150px; " @change="selectedYearChanged">
        <el-option
            v-for="item in yearOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>

      <el-button type="primary" style="margin-top: 20px;margin-right: 10px" @click="structAnalyse"
                 id="structAnalyseBtn">结构分析
      </el-button>
      <el-button type="primary" style="margin-top: 20px;" @click="structAnalyseShow" id="sizeAnalyseShow">查看分析结果
      </el-button>
    </div>
    <div id="shapeAnalyse" v-show="analyzeVisible">
      形态分析<br><br>
      <el-button @click="getBuildUpArea" type="primary" id="transportGeojson">传回矢量</el-button>
      <br>
      <el-radio v-model="radio" label="1" style="margin-top: 0px;margin-bottom: 0px">阈值法</el-radio>
      <el-radio v-model="radio" label="2" style="margin-top: 0px;margin-bottom: 0px">统计数据辅助法</el-radio>
      <div class="demo-input-suffix" v-if="radio==1">
        <p style="font-size: 2px">自定义阈值：</p>
        <el-input style="font-size: 2px"
                  placeholder="请输入0-60内的整数"
                  v-model="splitValue">
        </el-input>
      </div>
      <div class="demo-input-suffix" v-else-if="radio==2">
        <p style="font-size: 2px">面积统计值辅助法（未实现）：</p>
        <el-input placeholder="请输入0-60内的整数"
                  v-model=input1>
        </el-input>
      </div>
      <div class="demo-input-suffix">
        <p style="font-size: 2px">城市群：</p>
        <el-select v-model="value" placeholder="长江三角洲" @change="selectedCityChanged">
          <el-option
              v-for="item in citiesOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
        <el-button @click="deleteRecent" type="primary" style="margin-top: 20px;margin-left: 10px;" id="deleteRecent">重置</el-button>
        <el-button @click="morphological" type="primary" style="margin-top: 20px;margin-left: 10px;" id="morphological">形态分析</el-button>
      </div>
    </div>
    <div id="earthContainer">

    </div>
    <div id="drawControl" v-show="basicControlVisible">
      <el-button type="primary" @click="draw('point')" v-show="basicControlVisible">绘制点</el-button>
      <el-button type="primary" @click="draw('polyline')" v-show="basicControlVisible">绘制线</el-button>
      <el-button type="primary" @click="draw('polygon')" v-show="basicControlVisible">绘制面</el-button>
      <el-button type="primary" @click="clearDrawEntities" v-show="basicControlVisible">清空</el-button>
    </div>

    <div id="sizeShowPane" v-show="sizeOutVisible">
      <div id="sizeShowPane1"></div>
      <div id="sizeShowPane2"></div>
    </div>
    <div id="structShowPane" v-show="structOutVisible">
      <span>&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp;加拿大学者马歇尔将基尼系数的概念引入地理学，研究城市人口规模的差异，发展出
        城市基尼系数模型。</span>
      <el-divider>概念</el-divider>
      <span style="text-align: center;font-family: 楷体"><b><em>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;G = T/2(TNL)(n-1)</em></b></span>
      <span><br/><p style="font-size: 5px">&nbsp;&nbsp;&nbsp;式中，G为基尼系数，数值分布于0～1范围内；𝑇表示城市间夜光规模差值的绝对值之和；𝑇𝑁𝐿表示城市群夜光规模总量；𝑛表示城市群内的城市数量。当基尼系数接近0的时候，表示城市规模分散，反之，则表示城市规模趋于向核心城市集中。</p></span>
      <el-divider>计算方法</el-divider>
      <div id="structShowPane1"></div>
      <div id="structShowPane2"><b style="font-size: 15px">首位度</b>
        <p style="font-size: 5px">
          首位度该年份排名第一、第二的城市的夜间灯光总量指数之比。一般认为，当S大于2时，首位城市较为突出，具有较强的凝聚力；S越小，首位城市越不突出，小于1时，城市群双核结构发展明显。</p>
        <p style="font-size: 6px"><b>当前首位度：{{ firstDegree }}</b></p>
      </div>
    </div>
    <div id="shapeShowPane" v-show="shapeOutVisible" style="padding-bottom: 10px">
      <div style="margin-top: 10px "><el-text class="mx-1">周长:&nbsp;&nbsp;&nbsp;{{morptData.c}}</el-text></div>
      <el-divider></el-divider>
      <div ><el-text class="mx-1">面积:&nbsp;&nbsp;&nbsp;{{morptData.s}}</el-text></div>
      <el-divider></el-divider>
      <div ><p style="font-size: 5px"><el-text class="mx-1" type="info">破碎度指数可以表征城市群的分散程度，破碎度指数越高表明城市群内各城市建成区越分散。反之，城市群越聚集,破碎度指数越高表明城市群内各城市建成区越分散</el-text></p><el-text class="mx-1" type="success">破碎度:&nbsp;&nbsp;&nbsp;{{morptData.fragmentation}}</el-text></div>
      <el-divider></el-divider>
      <div ><p style="font-size: 5px"><el-text class="mx-1" type="info">分形维数反映了复杂形体占有空间的有效性，是复杂形体不规则性的量度。分形维数可以用来描述城市群的空间形态特征,越接近1表示城市群的形状越规则</el-text></p>
        <el-text class="mx-1" type="success">分型维度:&nbsp;&nbsp;&nbsp;{{morptData.division}}</el-text></div>
    </div>
  </div>

</template>

<script>
import * as Cesium from "cesium/Cesium";
import * as widgets from "cesium/Widgets/widgets.css";
import axios from "axios"
import * as echarts from 'echarts'

export default {
  name: 'EarthPane',
  mounted() {
    //组件初始化完成后，挂载到父容器中后触发
    this.initEarth();
    this.initChart1();
    this.initChart2();
  },
  data() {
    //保存组件的私有数据
    return {
      viewer: undefined,
      tempEntities: [],
      basicControlVisible: true,
      analyzeVisible: false,
      sizeOutVisible: false,
      structOutVisible: false,
      shapeOutVisible:false,
      shpLayerVisible:false,
      citiesOptions: [{
        value: '1',
        label: '长江三角洲'
      }, {
        value: '2',
        label: '珠三角城市群'
      }, {
        value: '3',
        label: '京津冀城市群'
      }, {
        value: '4',
        label: '长江中游城市群'
      }, {
        value: '5',
        label: '成渝城市群'
      }], yearOptions: [{
        value: '0',
        label: '2009年'
      }, {
        value: '1',
        label: '2010年'
      }, {
        value: '2',
        label: '2011年'
      }, {
        value: '3',
        label: '2012年'
      }, {
        value: '4',
        label: '2013年'
      }, {
        value: '5',
        label: '2014年'
      }, {
        value: '6',
        label: '2015年'
      }, ],
      selectedCityIndex: '1',
      selectedYearIndex: '3',
      chart1: undefined,
      chart2: undefined,
      transportData: {
        'selectedCityIndex': '1',
        'selectedYearIndex': '3'
      },
      transportDataThree: {
        'selectedCityIndex': '1',
        'selectedYearIndex': '3',
        'splitValue': '50'
      },
      firstDegree: 0,
      radio: '1',
      splitValue: '50',
      bulidUpArea: '',
      buildUpAreaLayer:undefined,
      shpLayerCount:0,
      morptData:{
        c : '1',
        s : '2',
        fragmentation : '4',
        division : '3'
      },
      isExtracted:false
    }
  },
  methods: {
    //定义组件的方法
    initEarth() {
      // bu zi qiang 个人token
      Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkMmM1YzA1NC1kZWVhLTQ2MDUtOGFmNS00ZTI3ODI0NWRjMTciLCJpZCI6OTQ2OTcsImlhdCI6MTY1MzE4NDYyN30.RGw0XX0-Cauz3adKmv3qMxIsblXIVitss8h8IoQdXec';
      let viewer = new Cesium.Viewer('earthContainer');
      this.viewer = viewer;
      const layer = viewer.imageryLayers.addImageryProvider(
          new Cesium.IonImageryProvider({assetId: 3812})
      );

      //设置初始位置
      viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(110.20, 34.55, 5000000)
      });

      var promise1 = Cesium.GeoJsonDataSource.load('chang1.json', {
        stroke: Cesium.Color.AZURE,
        fill: Cesium.Color.ORANGE.withAlpha(0.4), //注意：颜色必须大写，即不能为blue
        strokeWidth: 5,
      })
      promise1.then(function (dataSource) {
        viewer.dataSources.add(dataSource);
      })

      var promise2 = Cesium.GeoJsonDataSource.load('chang2.json', {
        stroke: Cesium.Color.YELLOW,
        fill: Cesium.Color.ORANGE.withAlpha(0.4), //注意：颜色必须大写，即不能为blue
        strokeWidth: 5,
      })
      promise2.then(function (dataSource) {
        viewer.dataSources.add(dataSource);
      })

      var promise3 = Cesium.GeoJsonDataSource.load('zhu.json', {
        stroke: Cesium.Color.BLACK,
        fill: Cesium.Color.ORANGE.withAlpha(0.4), //注意：颜色必须大写，即不能为blue
        strokeWidth: 5,
      })
      promise3.then(function (dataSource) {
        viewer.dataSources.add(dataSource);
      })

      var promise4 = Cesium.GeoJsonDataSource.load('chengyu.json', {
        stroke: Cesium.Color.BLUE,
        fill: Cesium.Color.ORANGE.withAlpha(0.4), //注意：颜色必须大写，即不能为blue
        strokeWidth: 5,
      })
      promise4.then(function (dataSource) {
        viewer.dataSources.add(dataSource);
      })

      var promise5 = Cesium.GeoJsonDataSource.load('jjj.json', {
        stroke: Cesium.Color.BROWN,
        fill: Cesium.Color.ORANGE.withAlpha(0.4), //注意：颜色必须大写，即不能为blue
        strokeWidth: 5,
      })
      promise5.then(function (dataSource) {
        viewer.dataSources.add(dataSource);
      })


    },
    initChart1() {
      if (this.chart1 != null && this.chart1 != "" && this.chart1 != undefined) {
        this.chart1.dispose();//解决echarts dom已经加载的报错
      }
      this.chart1 = echarts.init(document.getElementById('sizeShowPane1'))
      return 0;
    },
    initChart2() {
      if (this.chart2 != null && this.chart2 != "" && this.chart2 != undefined) {
        this.chart2.dispose();//解决echarts dom已经加载的报错
      }
      this.chart2 = echarts.init(document.getElementById('sizeShowPane2'))
      return 0;
    },
    selectedCityChanged(value) {
      this.$forceUpdate();
      this.selectedCityIndex = value;
    },
    selectedYearChanged(value) {
      this.$forceUpdate();
      this.selectedYearIndex = value;
    },
    sizeAnalyse() {
      const loading = this.$loading({
        lock: true,
        text: '后台计算中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.3)'
      });
      this.transportData.selectedCityIndex = this.selectedCityIndex;
      this.transportData.selectedYearIndex = this.selectedYearIndex;
      console.log(this.transportData);
      axios.post('/loginhh1', this.transportData) // 发送 GET 请求，URL 替换为你的实际接口地址
          .then(resp => {
            console.log(this.transportData);
            if (resp==null){
              alert("运行错误，请检查您的python环境");
              return null;
            }
            if (resp.data==null){
              alert("运行错误，请检查您的python环境");
              return null;
            }
            console.log(resp.data.data);
            const names = Object.keys(resp.data.data).map(key => resp.data.data[key].name)
            const values = Object.keys(resp.data.data).map(key => resp.data.data[key].value)
            let max = values[0];//假设数组第一位为最大值
            let max2 = values[1];//假设数组第二位为第二大值
            if (values[0] >= values[1]) {
              [max, max2] = [values[0], values[1]];//ES6语法：解构赋值
            } else {
              [max2, max] = [values[0], values[1]];
            }
            for (let i = 2; i < values.length; i++) {
              if (values[i] > max2) {
                if (values[i] > max) {
                  max2 = max;
                  max = values[i];
                } else {
                  max2 = values[i];
                }
              }
            }
            this.firstDegree = (max / max2).toFixed(2);
            this.initChart1();
            this.initChart2();
            let option = {
              xAxis: {
                title: {
                  text: '夜间灯光平均值',
                  left: 'center',
                  top: 5,
                  textStyle: {
                    fontSize: 20,
                    color: 'black'
                  }
                },
                type: 'category',
                data: names,
                axisLabel: {
                  interval: 0, //设置成 0 强制显示所有横轴信息
                  rotate: -90, //-30度角倾斜显示
                  show: true,
                  textStyle: {
                    color: 'black',  //更改坐标轴文字颜色
                    fontSize: 8      //更改坐标轴文字大小
                  }
                },
              },
              yAxis: {
                type: 'value'
              },
              series: [
                {
                  data: values,
                  type: 'bar'
                }
              ],
              color: 'red'
            };
            this.chart1.setOption(option);
// 指定图表的配置项和数据
            var option1 = {
              backgroundColor: '#2c343c',

              tooltip: {
                trigger: 'item'
              },
              visualMap: {
                show: false,
                min: 80,
                max: 600,
                inRange: {
                  colorLightness: [0, 1]
                }
              },
              series: [
                {
                  name: 'Access From',
                  type: 'pie',
                  radius: '55%',
                  center: ['50%', '50%'],
                  data: resp.data.data,
                  roseType: 'radius',
                  label: {
                    color: 'rgba(255, 255, 255, 0.3)'
                  },
                  labelLine: {
                    lineStyle: {
                      color: 'rgba(255, 255, 255, 0.3)'
                    },
                    smooth: 0.2,
                    length: 10,
                    length2: 20
                  },
                  itemStyle: {
                    color: '#c23531',
                    shadowBlur: 200,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  },
                  animationType: 'scale',
                  animationEasing: 'elasticOut',
                  animationDelay: function (idx) {
                    return Math.random() * 200;
                  }
                }
              ]
            };

            // 使用刚指定的配置项和数据显示图表。
            this.chart2.setOption(option1);
          })
          .catch(error => {
            // 请求失败，处理错误
            console.error(error);
          });
      loading.close();
    },
    sizeAnalyseShow() {
      this.sizeOutVisible = !this.sizeOutVisible;
      this.shapeOutVisible = false;
      this.structOutVisible = false;
    },
    structAnalyseShow() {
      this.sizeOutVisible = false;
      this.shapeOutVisible = false;
      this.structOutVisible = !this.structOutVisible;
    },
    analyzeBtnShow() {
      this.analyzeVisible = !this.analyzeVisible;
    },
    structAnalyse() {
      let url = '';
      if (this.selectedCityIndex === '1') {
        url = 'jini/长江三角洲.json'
      } else if (this.selectedCityIndex === '2') {
        url = 'jini/珠江三角洲.json'
      } else if (this.selectedCityIndex === '3') {
        url = 'jini/京津冀城市群.json'
      } else if (this.selectedCityIndex === '4') {
        url = 'jini/长江中下游.json'
      } else {
        url = 'jini/成渝城市群.json'
      }
      axios.get(url).then(res => {
        var myChart2 = echarts.init(document.getElementById('structShowPane1'));
        let dataArr = Object.values(res)
        let dataArrNew = dataArr[0];

        let dataValues = new Array();
        let names = new Array();
        let values = new Array();
        for (let i = 0; i < dataArr.length; i++) {
          dataValues.push(Object.values(dataArrNew[i]));
        }
        for (let i = 0; i < dataValues.length; i++) {
          names.push(dataValues[i][0]);
          values.push(dataValues[i][1]);
        }
        let option2 = {
          title: {
            text: "基尼系数"
          },

          xAxis: {
            type: 'category',
            data: names
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              data: values,
              type: 'line',
              smooth: true
            }
          ]
        };
        myChart2.setOption(option2);
      })
    },
    getBuildUpArea() {
      this.isExtracted = true;
      window.viewer = this.viewer;
      const loading = this.$loading({
        lock: true,
        text: '后台计算中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.3)'
      });
      this.transportDataThree.selectedCityIndex = this.selectedCityIndex;
      this.transportDataThree.selectedYearIndex = this.selectedYearIndex;
      this.transportDataThree.splitValue = this.splitValue;
      axios.post('/yuzhifa', this.transportDataThree) // 发送 GET 请求，URL 替换为你的实际接口地址
          .then(resp => {
            console.log(resp.data);
            this.bulidUpArea = JSON.parse(resp.data.data);
             window.viewer.dataSources.add(
                 Cesium.GeoJsonDataSource.load(this.bulidUpArea)
            )
            //console.log(JSON.parse(res.data));
            loading.close();
          })
          .catch(error => {
            // 请求失败，处理错误
            console.error(error);
          })
    },
    showBasicControl() {
      this.shapeOutVisible = false;
      this.structOutVisible = false;
      this.sizeOutVisible = false;
      console.log(this.viewer.imageryLayers._layers);
      window.viewer = this.viewer;
      if (this.shpLayerVisible==false){
        this.viewer.dataSources.remove(this.viewer.dataSources.get(4));
        this.viewer.dataSources.remove(this.viewer.dataSources.get(3));
        this.viewer.dataSources.remove(this.viewer.dataSources.get(2));
        this.viewer.dataSources.remove(this.viewer.dataSources.get(1));
        this.viewer.dataSources.remove(this.viewer.dataSources.get(0));
        this.shpLayerVisible = !this.shpLayerVisible;
        this.shpLayerCount = 0;
      }
      else{
        this.shpLayerCount=5;
        let promise1 = Cesium.GeoJsonDataSource.load('chang1.json', {
          stroke: Cesium.Color.AZURE,
          fill: Cesium.Color.ORANGE.withAlpha(0.4), //注意：颜色必须大写，即不能为blue
          strokeWidth: 5,
        })
        promise1.then(function (dataSource) {
          window.viewer.dataSources.add(dataSource);

        })

        let promise2 = Cesium.GeoJsonDataSource.load('chang2.json', {
          stroke: Cesium.Color.YELLOW,
          fill: Cesium.Color.ORANGE.withAlpha(0.4), //注意：颜色必须大写，即不能为blue
          strokeWidth: 5,
        })
        promise2.then(function (dataSource) {
          window.viewer.dataSources.add(dataSource);
        })

        let promise3 = Cesium.GeoJsonDataSource.load('zhu.json', {
          stroke: Cesium.Color.BLACK,
          fill: Cesium.Color.ORANGE.withAlpha(0.4), //注意：颜色必须大写，即不能为blue
          strokeWidth: 5,
        })
        promise3.then(function (dataSource) {
          window.viewer.dataSources.add(dataSource);
        })

        let promise4 = Cesium.GeoJsonDataSource.load('chengyu.json', {
          stroke: Cesium.Color.BLUE,
          fill: Cesium.Color.ORANGE.withAlpha(0.4), //注意：颜色必须大写，即不能为blue
          strokeWidth: 5,
        })
        promise4.then(function (dataSource) {
          window.viewer.dataSources.add(dataSource);
        })

        let promise5 = Cesium.GeoJsonDataSource.load('jjj.json', {
          stroke: Cesium.Color.BROWN,
          fill: Cesium.Color.ORANGE.withAlpha(0.4), //注意：颜色必须大写，即不能为blue
          strokeWidth: 5,
        })
        promise5.then(function (dataSource) {
          window.viewer.dataSources.add(dataSource);
        })
        this.shpLayerVisible = !this.shpLayerVisible;
      }
      // eslint-disable-next-line no-empty
      if (this.basicControlVisible == false) {
        this.viewer.animation.container.style.display = 'none';//隐藏动画控件
        this.viewer.timeline.container.style.display = 'none';//隐藏时间线控件
        this.viewer.geocoder.container.style.display = 'none';//隐藏地名查找控件
        this.viewer.cesiumWidget.creditContainer.style.display = 'none';//隐藏ceisum标识
        this.viewer.homeButton.container.style.display = 'none';
        this.viewer.sceneModePicker.container.style.display = 'none';
        this.viewer.baseLayerPicker.container.style.display = 'none'
        this.basicControlVisible=!this.basicControlVisible;
        // this.viewer.
      } else {
        this.viewer.animation.container.style.display = 'block';//隐藏动画控件
        this.viewer.timeline.container.style.display = 'block';//隐藏时间线控件
        this.viewer.geocoder.container.style.display = 'block';//隐藏地名查找控件
        this.viewer.cesiumWidget.creditContainer.style.display = 'block';//隐藏ceisum标识
        this.viewer.homeButton.container.style.display = 'block';
        this.viewer.sceneModePicker.container.style.display = 'block';
        this.viewer.baseLayerPicker.container.style.display = 'block';
        this.basicControlVisible=!this.basicControlVisible;
      }
    },
    getLength(firstPoint, secondPoint) {
      // 计算距离
      let length = Cesium.Cartesian3.distance(firstPoint, secondPoint);
      return length;
    },
    Bearing(from, to) {
      from = Cesium.Cartographic.fromCartesian(from);
      to = Cesium.Cartographic.fromCartesian(to);

      let lat1 = from.latitude;
      let lon1 = from.longitude;
      let lat2 = to.latitude;
      let lon2 = to.longitude;
      let angle = -Math.atan2(Math.sin(lon1 - lon2) * Math.cos(lat2), Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2));
      if (angle < 0) {
        angle += Math.PI * 2.0;
      }
      let degreesPerRadian = 180.0 / Math.PI; //弧度转化为角度
      angle = angle * degreesPerRadian; //角度
      return angle;
    },
    pointAngle(p1, p2, p3) {
      let bearing21 = this.Bearing(p1, p2);
      let bearing23 = this.Bearing(p2, p3);
      let angle = bearing21 - bearing23;
      if (angle < 0) {
        angle += 360;
      }
      return angle;
    },
    deleteRecent(){
      console.log(this.bulidUpArea);

      this.viewer.dataSources.remove(this.viewer.dataSources.get(this.shpLayerCount));
    },
    morphological(){
      if (this.isExtracted==false){
        alert("请先点击“传回矢量”，完成建成区提取");
        return null;
      }
      this.sizeOutVisible = false;
      this.structOutVisible = false;
      this.shapeOutVisible = !this.shapeOutVisible;
      axios.post('/morphological', this.transportDataThree) // 发送 GET 请求，URL 替换为你的实际接口地址
          .then(resp => {
            console.log(resp.data);
            console.log(resp.data.data);
            let strs = resp.data.data.split(':');
            this.morptData.s = strs[0] + '平方公里';
            this.morptData.c = strs[1] + '公里';
            this.morptData.division = strs[3];
            this.morptData.fragmentation = strs[2];

          }).catch(error => {
        // 请求失败，处理错误
        console.error(error);
      })},
    protectAreaShow(){

    },

    /**
     * 根据类型绘制对象
     * @param type point、polyline、polygon
     */
    draw(type) {
      //绘制点
      let that = this;
      let viewer = this.viewer;
      let tempEntities = this.tempEntities;
      let position = [];
      let tempPoints = [];
      // 开启深度检测
      viewer.scene.globe.depthTestAgainstTerrain = true;
      let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      switch (type) {
        case 'point':
          // 监听鼠标左键
          handler.setInputAction(function (movement) {
            // 从相机位置通过windowPosition 世界坐标中的像素创建一条射线。返回Cartesian3射线的位置和方向。
            let ray = viewer.camera.getPickRay(movement.position);
            // 查找射线与渲染的地球表面之间的交点。射线必须以世界坐标给出。返回Cartesian3对象
            position = viewer.scene.globe.pick(ray, viewer.scene);
            let point = that.drawPoint(position);
            tempEntities.push(point);
          }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
          // 左键双击停止绘制
          handler.setInputAction(function () {
            handler.destroy();//关闭事件句柄
            handler = null;
          }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
          // 右击单击停止绘制
          handler.setInputAction(function () {
            handler.destroy();//关闭事件句柄
            handler = null;
          }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
          break;
        case 'polyline':
          //鼠标移动事件
          handler.setInputAction(function (movement) {
          }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
          //左键点击操作
          handler.setInputAction(function (click) {
            //调用获取位置信息的接口
            let ray = viewer.camera.getPickRay(click.position);
            position = viewer.scene.globe.pick(ray, viewer.scene);
            tempPoints.push(position);
            let tempLength = tempPoints.length;
            //调用绘制点的接口
            let point = that.drawPoint(tempPoints[tempPoints.length - 1]);
            tempEntities.push(point);
            if (tempLength > 1) {
              let pointline = that.drawPolyline([tempPoints[tempPoints.length - 2], tempPoints[tempPoints.length - 1]]);
              tempEntities.push(pointline);
            } else {
              //tooltip.innerHTML = "请绘制下一个点，右键结束";
            }
          }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
          //右键点击操作
          handler.setInputAction(function (click) {
            let totalLength = 0;
            for (let i = 0; i < tempPoints.length - 2; i++) {

              totalLength += Cesium.Cartesian3.distance(tempPoints[i], tempPoints[i + 1]);
              ;
            }
            alert((totalLength / 1000).toFixed(2) + "公里");
            tempPoints = [];
            handler.destroy();//关闭事件句柄
            handler = null;
          }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

          break;
        case 'polygon':
          //鼠标移动事件
          handler.setInputAction(function (movement) {
          }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
          //左键点击操作
          handler.setInputAction(function (click) {
            //调用获取位置信息的接口
            let ray = viewer.camera.getPickRay(click.position);
            position = viewer.scene.globe.pick(ray, viewer.scene);
            tempPoints.push(position);
            let tempLength = tempPoints.length;
            //调用绘制点的接口
            let point = that.drawPoint(position);
            tempEntities.push(point);
            if (tempLength > 1) {
              let pointline = that.drawPolyline([tempPoints[tempPoints.length - 2], tempPoints[tempPoints.length - 1]]);
              tempEntities.push(pointline);
            } else {
              // tooltip.innerHTML = "请绘制下一个点，右键结束";
            }
          }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
          //右键点击操作
          handler.setInputAction(function (click) {
            let cartesian = viewer.camera.pickEllipsoid(click.position, viewer.scene.globe.ellipsoid);

            if (cartesian) {
              let tempLength = tempPoints.length;
              if (tempLength < 3) {
                alert('请选择3个以上的点再执行闭合操作命令');
              } else {
                //闭合最后一条线
                let pointline = that.drawPolyline([tempPoints[tempPoints.length - 1], tempPoints[0]]);
                tempEntities.push(pointline);
                that.drawPolygon(tempPoints);
                tempEntities.push(tempPoints);
                handler.destroy();//关闭事件句柄
                handler = null;
              }
            }
          }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
          break;
      }
    },
    drawPoint(position, config) {
      let viewer = this.viewer;
      let config_ = config ? config : {};
      return viewer.entities.add({
        name: "点几何对象",
        position: position,
        point: {
          color: Cesium.Color.SKYBLUE,
          pixelSize: 10,
          outlineColor: Cesium.Color.BLUE,
          outlineWidth: 3,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        }
      });
    },
    drawPolyline(positions, config_) {
      let viewer = this.viewer;
      if (positions.length < 1) return;

      let config = config_ ? config_ : {};

      return viewer.entities.add({
        name: "线几何对象",
        polyline: {
          positions: positions,
          width: config.width ? config.width : 5.0,
          material: new Cesium.PolylineGlowMaterialProperty({
            color: config.color ? new Cesium.Color.fromCssColorString(config.color) : Cesium.Color.GOLD,
          }),
          depthFailMaterial: new Cesium.PolylineGlowMaterialProperty({
            color: config.color ? new Cesium.Color.fromCssColorString(config.color) : Cesium.Color.GOLD,
          }),
          clampToGround: true,
        }
      });
    },
    /* 计算空间面积 */
    getArea(positions) {
      let res = 0
      for (let i = 0; i < positions.length - 2; i++) {
        let j = (i + 1) % positions.length;
        let k = (i + 2) % positions.length;
        let totalAngle = this.pointAngle(positions[i], positions[j], positions[k])
        let tempLength1 = this.getLength(positions[j], positions[0])
        let tempLength2 = this.getLength(positions[k], positions[0])
        res += tempLength1 * tempLength2 * Math.sin(totalAngle) / 2
      }
      res = res.toFixed(2)
      // console.log(res)
      res = parseFloat(res)
      // console.log(Math.abs(res))
      return Math.abs(res)
    },

    drawPolygon(positions, config_) {
      alert((this.getArea(positions) / 1000000).toFixed(2) + '平方公里')
      let viewer = this.viewer;
      if (positions.length < 2) return;
      let config = config_ ? config_ : {};
      return viewer.entities.add({
        name: "面几何对象",
        polygon: {
          hierarchy: positions,
          material: config.color ? new Cesium.Color.fromCssColorString(config.color).withAlpha(.2) : new Cesium.Color.fromCssColorString("#FFD700").withAlpha(.2),
        },
      });
    },
    /**
     * 清除实体
     */
    clearDrawEntities() {
      let viewer = this.viewer;
      this.tempEntities = [];
      // 清除之前的实体
      const entitys = viewer.entities._entities._array;
      let length = entitys.length
      // 倒叙遍历防止实体减少之后entitys[f]不存在
      for (let f = length - 1; f >= 0; f--) {
        if (entitys[f]._name && (entitys[f]._name === '点几何对象' || entitys[f]._name === '线几何对象' || entitys[f]._name === '面几何对象')) {
          viewer.entities.remove(entitys[f]);
        }
      }
    },
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

body html {
  margin: 0;
  padding: 0;
  overflow: hidden;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
  "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}

#head {
  position: relative;
  z-index: 30;
}

#head_tile {
  flex: 6;
  width: 30%;
  /*margin-top: 20px;*/
  background: url("images/top_left1.png") no-repeat;
  /*background: url("@~/images/common/top_left1.png") no-repeat;*/
  /*background-color: #65fd00;*/
  background-size: cover;
  background-position-x: 0;
  background-position-y: 0;
  line-height: 60px;
}

#earthContainer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
}

#drawControl {
  position: absolute;
  top: 100px;
  right: 100px;

}

#SizeAnalyse {
  margin-top: 0px;
  position: relative;
  z-index: 20;
  width: 200px;
  height: 220px;
  background-color: #f2f2f2;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 10px;
  place-items: center;
}

#structAnalyse {
  position: relative;
  z-index: 20;
  width: 200px;
  height: 220px;
  background-color: #f2f2f2;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 10px;
  place-items: center;
}

#shapeAnalyse {
  position: relative;
  z-index: 20;
  width: 200px;
  height: 290px;
  background-color: #f2f2f2;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 10px;
  place-items: center;
}

#sizeShowPane {
  width: 300px;
  height: 400px;
  background: #c1e59a;
  position: absolute;
  top: 200px;
  right: 50px;
  opacity: 100%;
  border-radius: 5px;
}

#sizeShowPane1 {
  width: 100%;
  height: 200px;
  background: #a9de70;
}

#sizeShowPane2 {
  width: 100%;
  height: 300px;
  background: #ffffff;
}

#structShowPane {
  width: 300px;
  height: 600px;
  background: #c1e59a;
  position: absolute;
  top: 200px;
  right: 50px;
  opacity: 100%;
  border-radius: 5px;
}

#structShowPane1 {
  width: 300px;
  height: 200px;
  background: #22ee22;
}
#shapeShowPane{
  width: 300px;
  height: 400px;
  background: #9ae1cb;
  position: absolute;
  top: 200px;
  right: 50px;
  opacity: 100%;
  border-radius: 20px;
}
</style>