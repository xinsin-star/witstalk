plugins {
    id("java")
}

group = "top.xinsin"
version = "1.0.0"

repositories {
    mavenCentral()
}

dependencies {
    implementation(project(":witstalk-common"))
    implementation("org.springframework.boot:spring-boot-starter-web")
}
