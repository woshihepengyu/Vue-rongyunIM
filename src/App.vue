<template>
	<div id="app">
		<router-view/>
	</div>
</template>

<script type="text/javascript">
	import { mapMutations , mapState } from 'vuex'
	import { getTokenRequest , getUserInfoRequest } from '@/util/axiosRequest'
	export default {
		data(){
			return {
				userPhone: '' //登录人电话号码 this.$route.params.loginPhone//localStorage.getItem('uPhone').replace(/\"/g,"")
			}
		},
		created() {
			//融云初始化
			RongIMLib.RongIMClient.init('bmdehs6pbghvs'); //appkey
			RongIMLib.RongIMEmoji.init();//初始化融云emoji
			this.beforeIm() //设置监听，必须先设置监听，再连接
			this.nowIm() //连接融云
		},
		computed:{
			...mapState({
				answer: "answer",//监听vuex中的answer的状态
			})
		},
		methods: {
			...mapMutations({ //读取最新消息列表，
				getAnswer: 'getAnswer',
				saveCount: 'saveCount'//vuex提交并设置并结合本地未读数量对实时消息的展示
			}),
			beforeIm() {
				let that = this
				// 融云连接状态监听器
				RongIMClient.setConnectionStatusListener({
					onChanged: function(status) {
						// status 标识当前连接状态
						switch(status) {
							case RongIMLib.ConnectionStatus.CONNECTED:
								console.log('链接成功');
								break;
							case RongIMLib.ConnectionStatus.CONNECTING:
								console.log('正在链接');
								break;
							case RongIMLib.ConnectionStatus.DISCONNECTED:
								console.log('断开连接');
								break;
							case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
								that.$toast('其他设备登录');
								break;
							case RongIMLib.ConnectionStatus.DOMAIN_INCORRECT:
								that.$toast('域名不正确');
								break;
							case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
								that.$toast('网络不可用');
								break;
						}
					}
				});
				// 融云消息监听器
				RongIMClient.setOnReceiveMessageListener({
					// 接收到的消息
					onReceived: function(message) {
						// 判断消息类型
						switch(message.messageType) {
							case RongIMClient.MessageType.TextMessage:
								// message.content.content => 文字内容
								//把获取的消息存放在store中
								message.content.messageType = message.messageType;
								message.content.receivedTime = message.receivedTime;
								// message.content.sender = that.userPhone;
								message.content.sender = message.senderUserId;
								that.getAnswer(message.content)
								that.saveCount(message.content.sender)
								break;
							case RongIMClient.MessageType.VoiceMessage:
								// message.content.content => 格式为 AMR 的音频 base64
								break;
							case RongIMClient.MessageType.ImageMessage:
								// message.content.content => 图片缩略图 base64
								// message.content.imageUri => 原图 URL
								message.content.messageType = message.messageType;
								message.content.receivedTime = message.receivedTime;
								message.content.sender = message.senderUserId;
								that.getAnswer(message.content)
								that.saveCount(message.content.sender)
								break;
							case RongIMClient.MessageType.LocationMessage:
								// message.content.latiude => 纬度
								// message.content.longitude => 经度
								// message.content.content => 位置图片 base64
								break;
							case RongIMClient.MessageType.RichContentMessage:
								// message.content.content => 文本消息内容
								// message.content.imageUri => 图片 base64
								// message.content.url => 原图 URL
								break;
							case RongIMClient.MessageType.InformationNotificationMessage:
								// do something
								break;
							case RongIMClient.MessageType.ContactNotificationMessage:
								// do something
								break;
							case RongIMClient.MessageType.ProfileNotificationMessage:
								// do something
								break;
							case RongIMClient.MessageType.CommandNotificationMessage:
								// do something
								break;
							case RongIMClient.MessageType.CommandMessage:
								// do something
								break;
							case RongIMClient.MessageType.UnknownMessage:
								// do something
								break;
							default:
								// do something
						}
					}
				});
			},
			nowIm() {
				let that = this;
				getUserInfoRequest({phone:that.userPhone}).then(res => {
					getTokenRequest({
						headImgUrl:res.data.userPortrait,
						nickName:res.data.userName,
						phone:that.userPhone
					}).then(res => {
						RongIMClient.connect(res.data.result, {//传入token
							onSuccess: function(userId) {
								console.log('Connect successfully. ' + userId);
							},
							onTokenIncorrect: function() {
								console.log('token 无效');
							},
							onError: function(errorCode) {
								var info = '';
								switch(errorCode) {
									case RongIMLib.ErrorCode.TIMEOUT:
										info = '超时';
										break;
									case RongIMLib.ConnectionState.UNACCEPTABLE_PAROTOCOL_VERSION:
										info = '不可接受的协议版本';
										break;
									case RongIMLib.ConnectionState.IDENTIFIER_REJECTED:
										info = 'appkey不正确';
										break;
									case RongIMLib.ConnectionState.SERVER_UNAVAILABLE:
										info = '服务器不可用';
										break;
								}
								that.$toast(info);
							}
						});
					})
				})
				
			}
		}
	}
</script>

<style lang="less">
	#app {
		font-family: 'Avenir', Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		color: #666;
	}
</style>