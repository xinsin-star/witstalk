plugins {
    id("java")
}

group = "top.xinsin"
version = "1.0.0"

repositories {
    mavenCentral()
}

dependencies {
    implementation("com.mybatis-flex:mybatis-flex-spring-boot3-starter:1.11.4")
    //    jwt
    implementation("io.jsonwebtoken:jjwt-api:0.13.0")
    runtimeOnly("io.jsonwebtoken:jjwt-impl:0.13.0")
    runtimeOnly("io.jsonwebtoken:jjwt-jackson:0.13.0")

    implementation("jakarta.xml.bind:jakarta.xml.bind-api:4.0.4")
    runtimeOnly("org.glassfish.jaxb:jaxb-runtime:4.0.4")
    // 新版本（Spring 4.0.0）中Redis的序列化需要依赖这个模块
    compileOnly("tools.jackson.core:jackson-databind:3.0.2")
}
