# 使用说明

[learn-vault-hello-world](https://github.com/hashicorp-education/learn-vault-hello-world) 的 nodeJs 实现

部署时  运维 提供环境变量：

* JWT_PATH      jwt token 路径(默认路径)
* VAULT_ADDR    vault 地址 
* SERVICE_PORT  当前服务暴露端口(如果模仿的不需要 server 服务，则不暴露)
* SECRET_PATH   秘钥路径
* ROLE          vault 读取秘钥角色

## 部署（本人测试）

```
docker build -t  tomatoares/test:1.0 .
```