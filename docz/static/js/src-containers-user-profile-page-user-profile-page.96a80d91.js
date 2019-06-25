(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{"./src/containers/UserProfilePage/UserProfilePage.mdx":function(e,o,A){"use strict";A.r(o),A.d(o,"default",function(){return d});var r=A("./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/extends.js"),n=A("./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js"),a=(A("./node_modules/react/index.js"),A("./node_modules/@mdx-js/react/dist/index.es.js")),t=A("./node_modules/docz/dist/index.esm.js"),i=A("./src/containers/UserProfilePage/UserProfilePageComponent.jsx"),g={},s="wrapper";function d(e){var o=e.components,A=Object(n.a)(e,["components"]);return Object(a.b)(s,Object(r.a)({},g,A,{components:o,mdxType:"MDXLayout"}),Object(a.b)("h1",{id:"userprofilepage"},"UserProfilePage"),Object(a.b)("p",null,"UserProfilePage is a container representing a ",Object(a.b)("inlineCode",{parentName:"p"},"UserProfile")," page. Profides funcitonality to ",Object(a.b)("inlineCode",{parentName:"p"},"Reset Password")," and ",Object(a.b)("inlineCode",{parentName:"p"},"Logout")," from ",Object(a.b)("inlineCode",{parentName:"p"},"SOLID"),"."),Object(a.b)("h1",{id:"structure"},"Structure"),Object(a.b)("p",null,Object(a.b)("inlineCode",{parentName:"p"},"UserProfilePage")," component exported from ",Object(a.b)("inlineCode",{parentName:"p"},"UserProfilePage")," folder is represented by a stateless react component and a react ",Object(a.b)("inlineCode",{parentName:"p"},"PureComponent")," serving as a container."),Object(a.b)("pre",null,Object(a.b)("code",Object(r.a)({parentName:"pre"},{className:"language-.md"}),"\u251c\u2500\u2500 UserProfilePageComponent.jsx # Stateless react component, responsible for ui\n\u251c\u2500\u2500 UserProfilePageContainer.jsx # React PureComponent, responsible for both UI and states\n\u2514\u2500\u2500 index.js\n")),Object(a.b)("h2",{id:"properties"},"Properties"),Object(a.b)(t.d,{of:i.a,mdxType:"Props"}),Object(a.b)("h2",{id:"example"},"Example"),Object(a.b)(t.c,{__position:1,__code:"<UserProfilePage\n  userProfile={{ webId: 'your amazing webID', name: 'cool name' }}\n  location={{ pathname: '/' }}\n/>",__scope:{props:this?this.props:A,Playground:t.c,Props:t.d,UserProfilePage:i.a},__codesandbox:"N4IgZglgNgpgziAXKCA7AJjAHgOgBYAuAtlEqAMYD2qBMNSIAPOhAG4AEE6AvADogAnSpQL8AfIwD0LVmJABfADQg0mXACsEyEFRp0CDSQCojvVO3YAVPBDjsAwpUwBlAIYYARpSzs8rux4wdOyuAK4ElESuBBDkrlBQAJ7sAOZ0MALRMOjsoXBoKWYWAAZUmHDu6F5YGcU47ACSYOyJlKEA5AIw7OShAhBtdniUAO7sBH4Evq4ADjPp6IotbT3uRT14MOQA1uxtU20C7OiU5EMZMIi-BAQzcIiSkikQE6EeOFREkmXwldXfTl-nm8GTM6yay1C7Gw836dHI3XcyTgBAEoRSKVgdhGLzw4xsdgqwKwSxmsH83UytkR5lscFCMHW1FSuLe9UQAEozEZJGYIEQZpQBFMAEowVzkKZgIREdidcWS9oAbj5AqFooVBAAIgB5ACy7GlkTlXQlBAAtCciMrVYLhQ5IoLUPpDTK5ThJNhXALYDbUGYxWbdXqcF0MBkABTrZhsMTrCyMPAAZjEjjVzponDVwuy7BxEx6gKJVRBAkQUmTcfMFnYjBmYgjDSmUWSztzrnQLBi1Hi7BmQju40oqRgUxe7DDmH6qBSeZgCQ5Unr8draadLskVYT0ljijMJ16RH0ODSBAAorAjzQAEKJBroCOdYQEdpc1AcpUKZRen0wHCaMgdGoWh6EQFRsymYB2AABSgVxEhSIRQgwJZoIHOx5FdY12gPAAvP1-TtSD2AAVTgDI0MoSBYGg1w0nYTCjVldoPTgARyABGhXDQDI4EkMiKKEaiYFotJ-PIgRKOE0SYDXah9AIiD2EDSUsOY01FTBVBdBRY5Tlw5wCESLF2G4dhgHWKIBGeVArnaAAGdgkxmLB2j3asZg7FgZzsgAWFz2AANhctz1jAYCADFvWgRI7P4ZxDgRB1MBgoR-CWIhqEoOBPIRULq3CmhnAgXDLnYABGXz3PkLSdKmABBOZTPYCMoPIGwoHQMMGI5UyxBa6MZHYFFjJgbhgDwwzRrgeQtxrYB2ugLrggAMhW8ZEnmKiNiW7ruH2uUwGQyUBlQdp2AAfh2zqwwjXqrkWm66Bq6spBkKs3zMGF1WOGAwDCKApjuvqBtexrl2rBMVIIHAIsyFIrwIOaa1rATJKE6ARLoxlIZR3IJKkzHxqgkYYA8e87NaPoQiiXCCjncmtTc9hUG9Mr2ioSgoBZtnzvkF68ZrKBTmiU7ib7aI8FZo87MkPmBbxzcVykaHYfhxG5qkcGPrML8QDYjjdAIbjnQEPi0cJmjsfEwSqMxmS5IzGHNCwQCjf0QxJHYAABMBhZGW0fuhtSTU1RSiPYerWGiVwjiYuVvaiWh-nic1QggAEukkKOY4EcOfuvcIInMeP2kTrIU6gNOM6oLPC5uah8_tew4Dga8KSgHiQ7LpOMggVP08zmBJBbtuO54pupgioUiEcGghG50vy-T_uq8H2vh-ngRZ-AhfJ8aVAZnCbvl77gea6FYeGkP8J9-vo-CAAGVcQJF7dHuK9X6uh8ke_wmf1--9oIZCIPefQLw7y6BPr3Su39YjUD4sA7eYCaAQJ1OETuzp0BANmBkaBn9z4_1orCfelhNqUEQrMPAyQl4wK_uvS-kgyGCkoTMah-98x4CmiZWhBC14XyziNLEkhOHcPgH6MwdVhpGRMmZCYMAjwg1apZE2VwLK4xxOgCYdkwgRHyijFgOU4KxTlB4YWOxmaPHYBFCAPgGhngquVTgrcGQ4BXFZGyj8_oECuPIo8OAcoSgKBGJMHJ3Iow8WgEUEAUiEF8ZsfxgTyDBNCeEmsABtPxf4PCmm2IKNABA4A4FCDMCMvl7KOQANT4gUX-JJwTAocg5AAXTUSuCwmjtHsAAKwVLSRE2OnjvE6PCJQfReNImoGibEnxcpdFjJXArJQ6xPKwjabjSZlhKAzHibUgJuVgkAA4wkrkMWSeCdk_bYHGRYK5WAtQQC6CdagdkqBQFCEQM6_SQidxSKgJsCj7hygRHoPO3zPKdgKFcYoAASYAWT9lBJnBGAATByeQAU4UIvqci0JGKfBYoSXUg5uL0UuWKOsZZ1ZXDR2NmWcy7jBloF2YkklKQ7orisR4CU2xEJtAwI4YW9KEWeVgDcOpWxqDoFjokHAUQ0CUrSeFbe6yUadLwHZcqFSACklivY2LsQ48qTi6SuMZdZNAWydk1NZUi9lb4LBUosPSDwRAXiqprJs7ZLLiV2pCQ6hiZh5Afi0kZeYqVtl2DMuoiw5A4Kt3gFcHUHh1BbAIGkvItthJJpTWmtJ1AAASlRYCPwofsewncdjZCuBFY63ZUD5tQEWjAVtW4jCFOgMU5FZm1u0vWoNKp_TaQQVMC2GMrZpEdi6Myyjqxxv8OROAGaCbjpgI25t6AS1lvCBW2I2xsjruLVjNtHau2jiDVcSidxercH6jGico4-jmCjLjRg8rzDztbgAOTZuNT9i65Um1mu01crd27kUwd0JWuMEzELwfOGAtKxbABRZhf9P6jx_vjQB1ZGRgMwZrIwHOdKejYYw2NBa2H4A4BpbnfDgsUaMCQaAzAqCjINCgdBhjtZs60tjsjPGjBmEUMyGw5Inx1w0D4CAPA5V-DsGjinKT_A8DdPECBlGaMI3CQ0zx4TrDqECcY8q2U6Hf2UYXdRkz9HuO1i3jveeXN2CTOk6gGe8R5NHQSAAdS4BMIzDHGB_yfi_ecw08DTl2IQEgW9pOk3JugdTBHuPebJo0LUunGO_xviF1-AXBZBZy5lvGpp0A6lQEkYrKMuDSdSx4dL_Aqs1mlmNfg8X7yNeSwx6O7yKOZvRnbWAOB2voAVrZ9gXHbNSHs3PVEXN8uEZm7vJzLn-Bue3h5kAhpQg-b83gBbjHgsALC3ACLaAovECgLFtbbMkvjZRuRprUgjuhagAdwjwWeaYZu0eeTPWGTjX65bP8LXMI1Z-4yLbk3uPTZnrNhe73GD12Lk1rzUBfNaLwE1xT_dlNAS4jxRLIAmvUF3Tscahaj20RPQITt8BRxjds28oU0n-z8hlZ1-7pGF3kaw5ZopLq3UEEZ4Ld7Fgz1TGp3AdttPitSGR9QRHCuh1c7RxjiY2PY644INJo2Jtsic_u6Tyt2wKdNqPaWlI5aTfZBFwx5nAhWf9CsokQ342zOYYswmgXbwhd25RmL9glv9hy8kMrhbUgTMBakHBgQAmpDvrmiG1A8hB1fSwBHKRY7BtY3omZURMj4ARiEfADkEZs_SWxlOmgye9a5W2Njf8cBqBu2Ah7MC96If8CuPwH4xZqgZHND-MkkO0n8FYLxU63f2D8HsjgOf9l0rrH4OUcg_QZj9qQDPkA9VhqEVgNCLA3oR-_TJJQRIuY8j0w0haPvfxSxL-rPwd90_-CqGwE3x_FgV8wHmOGbSEA8A0-963-IAeEr-IAAAeuVDgCivPl_jWPwDfhAeVIFDgIcjgIFAgaAafLAgwl0BAb5DgDASitgdvrgfQhnPAqgHAIQbAcQWQUgZqJaJECgWgRgVgcTtWC9PIHrP3t4B8NQJACkE3i3toO7KBCABZCALQD6FkN3r3qaLQOaDfuaLMDMPwLwfzPIEAA",mdxType:"Playground"},Object(a.b)(i.a,{userProfile:{webId:"your amazing webID",name:"cool name"},location:{pathname:"/"},mdxType:"UserProfilePage"})))}d&&d===Object(d)&&Object.isExtensible(d)&&Object.defineProperty(d,"__filemeta",{enumerable:!0,configurable:!0,value:{name:"MDXContent",filename:"src/containers/UserProfilePage/UserProfilePage.mdx"}}),d.isMDXComponent=!0}}]);
//# sourceMappingURL=src-containers-user-profile-page-user-profile-page.d8fe49b6fbcecedb6bd9.js.map