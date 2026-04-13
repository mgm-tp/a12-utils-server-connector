<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://www.mgm-tp.com/global-content/cd/logos/a12/app-icons/dark/A12-Dark.svg" />
  <img src="https://www.mgm-tp.com/global-content/cd/logos/a12/app-icons/light/A12-Light.svg" height="200" alt="A12 logo" />
</picture>

# Utils Server Connector

Utils Server connector is a generic component for request/response server communication.

Refer to https://geta12.com/#/docs to get started with A12 development.

---

## License
Parts of the A12 platform are made available under a **dual license**.  
Please check the [LICENSE](./LICENSE) file for details.

---

## Getting Started

### How to Use It
#### Import & Install
For the client, to install the latest npm package:

```sh
npm install @com.mgmtp.a12.utils/utils-connector@<version>
```

For the server,

**Gradle:**
```gradle
dependencies {
    implementation 'com.mgmtp.a12.utils:utils-rest-server-connector:<version>'
}
```

**Maven:**
```xml
<dependency>
    <groupId>com.mgmtp.a12.utils</groupId>
    <artifactId>utils-rest-server-connector</artifactId>
    <version>${version}</version>
</dependency>
```

### How to Build and Run

#### Prerequisites

The following tools are required in order to build this repository:

| Tool                              |  Version |
|-----------------------------------|---------:|
| [JDK](https://openjdk.org/)       |   `21.x` |
| [Node](https://nodejs.org/)       |   `22.x` |
| [Gradle](https://gradle.org/)     | `8.14.x` |

#####

#### How to Build
To build the project, follow the steps below.

For the client (utils-connector-client):

* Change to the client directory:
```shell
cd utils-connector-client
```

* Install all dependencies and compile the package:
```shell
npm install
npm run compile
```

For the server (using the Gradle Wrapper), run from the project root:

```shell
./gradlew assemble
```

#### How to Test
To run the tests, use the following commands.

For the client (utils-connector-client):

* Change to the client directory:
```shell
cd utils-connector-client
```

* Run the unit tests:
```shell
npm run test
```

For the server (using the Gradle Wrapper), run from the project root:
```shell
./gradlew check
```

### Documentation
- Full technical documentation is available at [GetA12.com](https://GetA12.com).
- The website also provides access to the **A12 Discourse Community Forum**.

---

**The mgm A12 Team**

[mgm technology partners GmbH](https://www.mgm-tp.com) • [Imprint](https://www.mgm-tp.com/imprint.html)
