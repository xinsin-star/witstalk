plugins {
    id("java")
    // 应用 JaCoCo 插件（核心插件，不需要版本号）
    id("jacoco")
}

repositories {
    mavenCentral()
}

dependencies {
    testImplementation(platform("org.junit:junit-bom:5.10.0"))
    testImplementation("org.junit.jupiter:junit-jupiter")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

tasks.test {
    useJUnitPlatform()
    // 启用 JaCoCo 覆盖率报告生成
    finalizedBy(tasks.jacocoTestReport)
}

// 配置 JaCoCo 测试覆盖率报告
tasks.jacocoTestReport {
    // 启用 HTML 报告
    reports {
        html.required = true
        xml.required = true
        csv.required = false
        // 设置 HTML 报告输出位置
        html.outputLocation.set(layout.buildDirectory.dir("jacocoHtml"))
    }
}
