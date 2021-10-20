const request = require("request");

const User = require("./models/User.js");
const Group = require("./models/Group.js");
const Item = require("./models/Item.js");

let jwt = "";

function post(url, body, type = "POST") {
  return new Promise((resolve, reject) => {
    request(
      {
        url: "http://nginx/api" + url,
        method: type,
        body: body,
        json: true,
        headers: { Cookie: `jwt=${jwt};` },
      },
      function (err, response, body) {
        if (err) reject(err);
        resolve(body);
      }
    );
  });
}

async function dropCollections() {
  return Promise.all([
    User.collection.drop(),
    Group.collection.drop(),
    Item.collection.drop(),
  ]);
}

async function init() {
  // Drop [User, Group, Item] Collections
  try {
    await dropCollections();
  } catch (e) {}

  let users = {};
  let groups = {};
  let items = {};

  /****** Squadron Start ******/

  // Create Logicom (Logistics Command) (군수사)
  let logicom = {
    serviceNumber: "logicom",
    password: "logicom",
    name: "박소장",
    rank: "소장",
    title: "군수사령관",
    status: "admin",
    email: "navylogicom@navy.mil",
    tel: {
      military: "0000",
      mobile: "010-0000-0000",
    },
    profileImageUrl:
      "https://user-images.githubusercontent.com/67567023/137678863-c728e29f-8049-42a3-b858-c7fbe9579152.png",
  };
  users.logicom = await post("/user", logicom);

  // login as logicom
  jwt = (
    await post("/login", {
      serviceNumber: "logicom",
      password: "logicom",
    })
  ).token;

  // Create group
  groups.logicom = await post("/group", {
    name: "군수사령부",
    path: "",
    admins: [users.logicom._id],
  });

  // Update logicom's group
  users.logicom = await post(
    `/user/${users.logicom._id}`,
    {
      group: groups.logicom._id,
    },
    "PUT"
  );
  /****** logicom End ******/

  /****** icsqd Start ******/

  // Create icsqd (information & communication squadron)
  let icsqd = {
    serviceNumber: "icsqd",
    password: "icsqd",
    name: "전민철",
    rank: "대령",
    title: "전대장",
    status: "admin",
    email: "icsqd@navy.mil",
    tel: {
      military: "0000",
      mobile: "010-0000-0000",
    },
    profileImageUrl:
      "https://user-images.githubusercontent.com/67567023/137678866-a32d7e12-caa5-458a-8620-a9e9ac180b80.png",
  };
  users.icsqd = await post("/user", icsqd);

  // login as icsqd
  jwt = (
    await post("/login", {
      serviceNumber: "icsqd",
      password: "icsqd",
    })
  ).token;

  // Create group
  groups.icsqd = await post("/group", {
    name: "정보통신전대",
    path: groups.logicom.path,
    admins: [users.icsqd._id],
  });

  // Update icsqd's group
  users.icsqd = await post(
    `/user/${users.icsqd._id}`,
    {
      group: groups.icsqd._id,
    },
    "PUT"
  );
  /****** icsqd End ******/

  /****** Create 박찬우 대위 ******/
  let AAA = {
    serviceNumber: "16-19999",
    password: "16-19999",
    name: "박찬우",
    rank: "대위",
    title: "사이버과장",
    status: "active",
    email: "21-19999@navy.mil",
    tel: {
      military: "0000",
      mobile: "010-0000-0000",
    },
    profileImageUrl:
      "https://user-images.githubusercontent.com/67567023/137678752-5e08d457-a8c2-4efe-85c2-020b4df59d4c.png",
  };
  users.AAA = await post("/user", AAA);

  // login as AAA
  jwt = (
    await post("/login", {
      serviceNumber: "16-19999",
      password: "16-19999",
    })
  ).token;

  groups.AAA = await post("/group", {
    name: "사이버과",
    path: groups.icsqd.path,
    admins: [users.icsqd._id],
  });

  // Update AAA's group
  users.AAA = await post(
    `/user/${users.AAA._id}`,
    {
      group: groups.AAA._id,
    },
    "PUT"
  );

  /****** AAA End ******/

  /****** Create 박대영 대위 ******/
  let BBB = {
    serviceNumber: "14-19999",
    password: "14-19999",
    name: "박대영",
    rank: "대위",
    title: "정보통신과장",
    status: "active",
    email: "14-19999@navy.mil",
    tel: {
      military: "0000",
      mobile: "010-0000-0000",
    },
    profileImageUrl:
      "https://user-images.githubusercontent.com/67567023/137678869-cefa34d6-bbfa-4da8-b87d-6e9c01ce6c85.png",
  };
  users.BBB = await post("/user", BBB);

  // login as BBB
  jwt = (
    await post("/login", {
      serviceNumber: "14-19999",
      password: "14-19999",
    })
  ).token;

  groups.BBB = await post("/group", {
    name: "정보통신과",
    path: groups.icsqd.path,
    admins: [users.icsqd._id],
  });

  // Update BBB's group
  users.BBB = await post(
    `/user/${users.BBB._id}`,
    {
      group: groups.BBB._id,
    },
    "PUT"
  );
  /****** BBB End ******/

  /****** Create 김길동 소령 ******/
  let CCC = {
    serviceNumber: "08-19999",
    password: "08-19999",
    name: "김길동",
    rank: "소령",
    title: "전기대장",
    status: "active",
    email: "08-19999@navy.mil",
    tel: {
      military: "0000",
      mobile: "010-0000-0000",
    },
    profileImageUrl:
      "https://user-images.githubusercontent.com/67567023/137678861-9a17f892-2fbb-4889-be06-2165f8350943.png",
  };
  users.CCC = await post("/user", CCC);

  // login as CCC
  jwt = (
    await post("/login", {
      serviceNumber: "08-19999",
      password: "08-19999",
    })
  ).token;

  groups.CCC = await post("/group", {
    name: "전기대",
    path: groups.icsqd.path,
    admins: [users.icsqd._id],
  });

  // Update CCC's group
  users.CCC = await post(
    `/user/${users.CCC._id}`,
    {
      group: groups.CCC._id,
    },
    "PUT"
  );
  /****** CCC End ******/

  /****** Create 이병 오지환  ******/
  let aaa = {
    serviceNumber: "21-71009999",
    password: "21-71009999",
    name: "오지환",
    rank: "이병",
    title: "CERT감시병",
    status: "active",
    email: "21-71009999@navy.mil",
    tel: {
      military: "0000",
      mobile: "010-0000-0000",
    },
    profileImageUrl:
      "https://user-images.githubusercontent.com/67567023/137697785-811e6ae3-0bf3-4ddc-b031-5976293b1573.png",
  };
  users.aaa = await post("/user", aaa);

  // login as aaa
  jwt = (
    await post("/login", {
      serviceNumber: "21-71009999",
      password: "21-71009999",
    })
  ).token;

  // Update aaa's group
  users.aaa = await post(
    `/user/${users.aaa._id}`,
    {
      group: groups.AAA._id,
    },
    "PUT"
  );
  /****** aaa End ******/

  /****** Create 상병 이상훈  ******/
  let bbb = {
    serviceNumber: "20-71009999",
    password: "20-71009999",
    name: "이상훈",
    rank: "상병",
    title: "정보통신관리병",
    status: "active",
    email: "20-71009999@navy.mil",
    tel: {
      military: "0000",
      mobile: "010-0000-0000",
    },
    profileImageUrl:
      "https://user-images.githubusercontent.com/67567023/137697751-3af02605-7b60-4dd2-b92b-b350fe46c30b.png",
  };
  users.bbb = await post("/user", bbb);

  // login as bbb
  jwt = (
    await post("/login", {
      serviceNumber: "20-71009999",
      password: "20-71009999",
    })
  ).token;

  // Update bbb's group
  users.bbb = await post(
    `/user/${users.bbb._id}`,
    {
      group: groups.BBB._id,
    },
    "PUT"
  );
  /****** bbb End ******/

  /****** Create 일병 조현서  ******/
  let ccc = {
    serviceNumber: "21-71000000",
    password: "21-71000000",
    name: "조현서",
    rank: "일병",
    title: "전기병",
    status: "active",
    email: "21-71000000@navy.mil",
    tel: {
      military: "0000",
      mobile: "010-0000-0000",
    },
    profileImageUrl:
      "https://user-images.githubusercontent.com/67567023/137697741-ea28073b-4cdd-4439-ad80-4f619363a4f8.png",
  };
  users.ccc = await post("/user", ccc);

  // login as ccc
  jwt = (
    await post("/login", {
      serviceNumber: "21-71000000",
      password: "21-71000000",
    })
  ).token;

  // Update ccc's group
  users.bbb = await post(
    `/user/${users.ccc._id}`,
    {
      group: groups.CCC._id,
    },
    "PUT"
  );
  /****** ccc End ******/

  let item1 = {
    title: "CERT",
    type: "cabinet",
    owner: users.AAA._id,
    path: "",
    content: `<p>CERT는 4직제(주야비비) 당직근무를 선다.</p><p>주 업무는 재진지역의 사이버 방호 임무이다.</p>`,
    tags: ["CERT"],
    accessGroups: {
      read: [groups.AAA._id, groups.BBB._id, groups.CCC._id],
      edit: [groups.AAA._id],
    },
    status: "published",
    comments: [
      {
        content:
          "좋은 문서 감사합니다! 저희 부대의 신임 간부와 전입 병사들에게 큰 도움이 될 것 같습니다. 혹시 주 장비실 청소 방법에 대한 내용을 추가해주실 수 있으십니까?",
        by: users.AAA._id,
        date: new Date("2021-9-10"),
      },
      {
        content:
          "피드백 감사합니다. 주 장비실 청소 방법에 대한 카드 문서를 추가했습니다!",
        by: users.CCC._id,
        date: new Date("2021-9-11"),
      },
      {
        content:
          "안녕하십니까! 저희 부대에서는 다른 방식으로 NAC 계정들을 관리하고 있는데, 저희 부대의 방식을 공유드리고 싶어 이 서랍을 복제해 저희 부대의 문서를 작성해보았습니다. 확인해보시면 큰 도움이 되실 겁니다! ",
        by: users.BBB._id,
        date: new Date("2021-9-11"),
      },
    ],
    created: new Date("2021-9-9"),
  };

  jwt = (
    await post("/login", {
      serviceNumber: "16-19999",
      password: "16-19999",
    })
  ).token;
  items.item1 = await post("/item", item1);

  await post(
    `/item/${items.item1._id}`,
    {
      content: `<p>CERT는 4직제(주야비비) 당직근무를 선다.</p><p>주 업무는 재진지역의 사이버 방호 임무이다.</p><p>진해 해군기지 전체를 관리하기 때문에 타 부대 CERT보다 업무가 많은 편이다.</p>`,
    },
    "PUT"
  );

  let item11 = {
    title: "주간 당직",
    type: "document",
    owner: users.AAA._id,
    path: items.item1.path,
    content: `<blockquote><p>⛔ 주간 주 업무는 재진부대 <strong>네트워크 관제</strong> 및 <strong>NAC 관리</strong>이다.<br>     위의 임무는 별도의 문서에서 서술한다.</p></blockquote><h3>0800i : 출근 및 인수인계</h3><blockquote><p>주간 당직은 <em>주야<s>비비</s></em> 이후 출근하는 것이므로 새로운 사항이 많다.<br>질문사항이 있으면 그때 그때 질문하며, <strong>모르는 사항이 없도록 최대한 숙지</strong>한다.</p></blockquote><h3>0845i : 분리수거</h3><blockquote><p>주장비실 내부의 쓰레기를 배출한다.</p></blockquote><p>[ CARD | 주장비실 청소 법]</p><h3>1000i : 유해 정보 차단</h3><blockquote><p>상위부대에서 전파하는 유해정보를 차단한다.</p></blockquote><h3>1115i : 1차 식교대</h3><blockquote><p>점심식사</p></blockquote><h3>1200i : 2차 식교대</h3><blockquote><p>점심식사</p></blockquote><h3>1300i : 유해 정보 차단</h3><blockquote><p>상위부대에서 전파하는 유해정보를 차단한다.</p></blockquote><h3>1500i : 유해 정보 차단</h3><blockquote><p>상위부대에서 전파하는 유해정보를 차단한다.</p></blockquote><h3>1700i : 유해 정보 차단</h3><blockquote><p>상위부대에서 전파하는 유해정보를 차단한다.</p></blockquote><h3>1745i : 야간자 인수인계 및 퇴근</h3><blockquote><p>야간자에게 주간당직 및 이전당직간 있었던 일들을 꼼꼼히 인수인계 한 후 퇴근한다.</p></blockquote>`,
    tags: ["CERT", "주간"],
    accessGroups: {
      read: [groups.AAA._id, groups.BBB._id, groups.CCC._id],
      edit: [groups.AAA._id],
    },
    status: "published",
    comments: [],
    created: new Date("2021-9-10"),
  };

  items.item11 = await post("/item", item11);

  let item12 = {
    title: "야간 당직",
    type: "document",
    owner: users.AAA._id,
    path: items.item1.path,
    content: `<blockquote><p>⛔ 야간 주 업무는 재진부대 <strong>네트워크 관제</strong> 및 <strong>NAC 관리</strong>이다.<br>     위의 임무는 별도의 문서에서 서술한다.</p></blockquote><h3>1745i : 출근 및 인수인계</h3><blockquote><p>질문사항이 있으면 그때 그때 질문하며, <strong>모르는 사항이 없도록 최대한 숙지</strong>한다.</p></blockquote><h3>1745i : 체계별 용량조사</h3><blockquote><p>체계의 안정적인 운영을 위해 매일 용량조사를 실시한다.</p></blockquote><p>[ CARD | 용량조사 하는 법 ]</p><h3>1830i : 주장비실 청소</h3><blockquote><p>청소를 한다.<br>주간과 다른 사항은 세절기를 비워야한다.</p></blockquote><h3>1900i : 유해 정보 차단</h3><blockquote><p>상위 부대에서 전파한 유해 정보를 차단한다.</p></blockquote><h3>2300i : 당직실에 보내야 할 것들 보내기</h3><blockquote><p>카드 참고</p></blockquote><h3>2330i : 일일 로그 분석</h3><blockquote><p>하루 동안 발생한 로그를 분석한다.</p></blockquote><p>[ CARD | 방화벽 로그분석 ] [ CARD | IPS 로그분석 ] [ CARD | NAC 로그분석 ] [ CARD | TMS 로그분석 ]</p><h3>0000i : 유해 정보 차단</h3><blockquote><p>상위부대에서 전파하는 유해정보를 차단한다.</p></blockquote><h3>0400i : 유해 정보 차단, 비밀업무</h3><h3>0530i : 비밀업무</h3><h3>0700i : 유해 정보 차단</h3><blockquote><p>상위부대에서 전파하는 유해정보를 차단한다.</p></blockquote><h3>0800i : 인수인계 및 퇴근</h3><blockquote><p>주간자에게 야간당직 및 이전당직간 있었던 일들을 꼼꼼히 인수인계 한 후 퇴근한다.</p></blockquote>`,
    tags: ["CERT", "야간"],
    accessGroups: {
      read: [groups.AAA._id, groups.BBB._id, groups.CCC._id],
      edit: [groups.AAA._id],
    },
    status: "published",
    comments: [],
    created: new Date("2021-9-10"),
  };

  items.item12 = await post("/item", item12);

  let item13 = {
    title: "주 업무 - 네트워크 관리",
    type: "document",
    owner: users.AAA._id,
    path: items.item1.path,
    content: `<h2>IPAM</h2><blockquote><p>IPAM(IP Address Management)는 <strong>IP 사용 현황 및 접근 권한</strong>을 관리하는 솔루션이다.</p></blockquote><h3>IPAM 기능</h3><ul><li><p>기본적으로 모두 차단된 상태이며, <strong>인가된 IP만 통신</strong>이 가능하게 한다.</p></li><li><p>한 IP에 다수의 장비가 연결된 경우 차단 및 관리자에게 통보한다.</p></li><li><p>장기 미접속 IP를 통제한다.</p></li></ul><p><br class="ProseMirror-trailingBreak"></p><h2>NAC</h2><blockquote><p>NAC(Network Access Control)는 사용자의 디바이스에 <strong>정책을 적용</strong>하여 망 접근을 제어하는 솔루션이다.</p></blockquote><h3>NAC 기능</h3><ul><li><p>비인가된 사용자의 접근을 막는다.</p></li><li><p>악성코드 및 네트워크 침해시도 발견시 <strong>사용자 추적</strong>을 용이하게 한다.</p></li><li><p>PMS(Patch Management System)을 통해 <strong>긴급 패치사항을 배포</strong> 및 자동설치한다.</p></li><li><p><strong>백신 업데이트</strong> 현황을 관리 및 백신이 업데이트 되지 않은 <strong>Client를 차단</strong>한다.</p></li></ul><p><br class="ProseMirror-trailingBreak"></p><h2>전화대응</h2><blockquote><p>전화가 많이온다. 전화에 응답할 때에는 다음과 같이 안내한다.</p></blockquote><ul><li><p>필승! ㅇㅇㅇ CERT 이병 ㅇㅇㅇ입니다!<br>한 마음으로 적극 지원하겠습니다. 무엇을 도와드립니까?</p></li><li><p><em>나 ㅇㅇㅇ에서 근무하는 ㅇㅇㅇ ㅇㅇ인데</em></p></li><li><p>네, 필승! 수고많으십니다.</p></li><li><p><em>ㅇㅇㅇ을 좀 하려고 하는데 ㅇㅇㅇ이 잘 안되네?</em></p></li><li><p>네 군번 <code>여쭤봐도 좋습니까?</code></p></li></ul><blockquote><p>상대방에게 질문할 경우에는 <code>"~가 뭡니까?"</code> 가 아니라 최대한 <strong>돌려말한다.</strong></p></blockquote><ul><li><p><em>00-000000</em></p></li><li><p>잠시만 기다려주십시오. (관련 문제를 해결한다)</p></li><li><p>(문제를 해결한 후) 통신보안?</p></li><li><p><em>통신보안</em></p></li><li><p>네 조치해드렸습니다.<br>~~~ 하신 후 사용하시면 됩니다.</p></li><li><p><em>알았어 수고해~</em></p></li><li><p>네, 필승 수고하십시오!</p></li></ul><blockquote><p>상대방에게 수화기 내려놓는 소리가 들리지 않도록,<br>상대방이 통화를 완전히 끊을 때 까지 기다린 후 수화기를 놓는다.</p></blockquote><h3>전화대응 - 상황별 조치법</h3><p>[ CARD | IP 관리 ] [ CARD | NAC 계정 관련 ] [ CARD | NAC 정책 관리 ] </p>`,
    tags: ["CERT", "주 업무"],
    accessGroups: {
      read: [groups.AAA._id, groups.BBB._id, groups.CCC._id],
      edit: [groups.AAA._id],
    },
    status: "published",
    comments: [],
    created: new Date("2021-9-10"),
  };

  items.item13 = await post("/item", item13);

  let item14 = {
    title: "부 업무 - 유해 정보 차단",
    type: "document",
    owner: users.AAA._id,
    path: items.item1.path,
    content: `<h2>유해 정보 차단</h2><blockquote><p>상위부대에서 전파하는 유해 정보의 종류에는 크게 3종류가 있다.<br>우리는 전파받은 정보를 주기적으로 차단조치 해야한다.</p></blockquote><h3>유해 정보 차단 방법</h3><p>[ CARD | IP 차단 ] [ CARD | URL 차단 ] [ CARD | 유해 계정 차단 ] </p>`,
    tags: ["CERT", "부 업무"],
    accessGroups: {
      read: [groups.AAA._id, groups.BBB._id, groups.CCC._id],
      edit: [groups.AAA._id],
    },
    status: "published",
    comments: [],
    created: new Date("2021-9-10"),
  };

  items.item14 = await post("/item", item14);

  let item111 = {
    title: "주장비실 청소 법",
    type: "card",
    owner: users.AAA._id,
    path: items.item11.path,
    content: `<h3>공통업무</h3><blockquote><p>ㅇ 일반쓰레기통A 확인<br>ㅇ 일반쓰레기통B 확인<br>ㅇ 분리수거 쓰레기통A 확인<br>ㅇ 분리수거 쓰레기통B 확인</p></blockquote><h3>요일별 분리수거</h3><blockquote><p>매일 0845i에 분리수거를 실시한다.</p></blockquote><ul><li><p>월요일 : 재활용 쓰레기 배출</p></li><li><p>화요일 : 일반 쓰레기 배출</p></li><li><p>수요일 : 안타는 쓰레기 배출</p></li><li><p>목요일 : 재활용 쓰레기 배출</p></li><li><p>금요일 : 일반 쓰레기 배출</p></li></ul>`,
    tags: ["주장비실", "청소"],
    accessGroups: {
      read: [groups.AAA._id, groups.BBB._id, groups.CCC._id],
      edit: [groups.AAA._id, groups.BBB._id, groups.CCC._id],
    },
    status: "published",
    comments: [],
    created: new Date("2021-9-10"),
  };

  items.item111 = await post("/item", item111);

  let item121 = {
    title: "용량조사 하는 법",
    type: "card",
    owner: users.AAA._id,
    path: items.item12.path,
    content: `<p>용량조사를 위한 한글파일과 엑셀파일을 연다.</p><br><p>용량조사를 진행하는 체계는 총 N개로...</p>`,
    tags: [],
    accessGroups: {
      read: [groups.AAA._id],
      edit: [groups.AAA._id],
    },
    status: "published",
    comments: [],
    created: new Date("2021-9-10"),
  };

  items.item121 = await post("/item", item121);

  let item122 = {
    title: "방화벽 로그 분석 방법",
    type: "card",
    owner: users.AAA._id,
    path: items.item12.path,
    content: `<p>방화벽 로그를 분석하는 이유는 실시간으로 관제하고 있지만, 혹시 놓친 로그를 발견하고 대응하기 위해서이다.</p><br><p>로그 분석 방법은...</p>`,
    tags: [],
    accessGroups: {
      read: [groups.AAA._id],
      edit: [groups.AAA._id],
    },
    status: "published",
    comments: [],
    created: new Date("2021-9-10"),
  };

  items.item122 = await post("/item", item122);

  let item123 = {
    title: "IPS 로그 분석 방법",
    type: "card",
    owner: users.AAA._id,
    path: items.item12.path,
    content: `<p>IPS는 IPS(Intrusion Prevention System)란 용어 그대로 침입방지시스템이다.</p><br><p>대부분의 패킷은 방화벽을 이용해 필터링 되기 때문에...</p>`,
    tags: [],
    accessGroups: {
      read: [groups.AAA._id],
      edit: [groups.AAA._id],
    },
    status: "published",
    comments: [],
    created: new Date("2021-9-10"),
  };

  items.item123 = await post("/item", item123);

  let item124 = {
    title: "NAC 로그 분석 방법",
    type: "card",
    owner: users.AAA._id,
    path: items.item12.path,
    content: `<p>NAC로그는 이벤트가 다양하고 양이 방대해 시간이 매우 오래 걸릴 수 있다.</p><br><p>NAC는 1차적으로...</p>`,
    tags: [],
    accessGroups: {
      read: [groups.AAA._id],
      edit: [groups.AAA._id],
    },
    status: "published",
    comments: [],
    created: new Date("2021-9-10"),
  };

  items.item124 = await post("/item", item124);

  let item125 = {
    title: "TMS 로그 분석 방법",
    type: "card",
    owner: users.AAA._id,
    path: items.item12.path,
    content: `<p>TMS(Threat Management System)는 1차(방화벽) 2차(IPS)등의 보안장비 이후 설치되는 경우가 대부분으로...</p>`,
    tags: [],
    accessGroups: {
      read: [groups.AAA._id],
      edit: [groups.AAA._id],
    },
    status: "published",
    comments: [],
    created: new Date("2021-9-10"),
  };

  items.item125 = await post("/item", item125);

  let item131 = {
    title: "IP 관리",
    type: "card",
    owner: users.AAA._id,
    path: items.item13.path,
    content: `<p>재진부대의 IP는 크게 N개의 분류로 나뉜다.</p><br><p>각각의 유형마다 나타나는 특징이 조금씩 다른데...</p>`,
    tags: [],
    accessGroups: {
      read: [groups.AAA._id],
      edit: [groups.AAA._id],
    },
    status: "published",
    comments: [],
    created: new Date("2021-9-10"),
  };

  items.item131 = await post("/item", item131);

  let item132 = {
    title: "NAC 계정 관리",
    type: "card",
    owner: users.AAA._id,
    path: items.item13.path,
    content: `<p>NAC 계정은 기본적으로...</p>`,
    tags: [],
    accessGroups: {
      read: [groups.AAA._id],
      edit: [groups.AAA._id],
    },
    status: "published",
    comments: [],
    created: new Date("2021-9-10"),
  };

  items.item132 = await post("/item", item132);

  let item133 = {
    title: "NAC 정책 관리",
    type: "card",
    owner: users.AAA._id,
    path: items.item13.path,
    content: `<p>NAC 정책은 크게 N개의 종류로 나눌 수 있다.</p><br><p>각 정책은 여러가지 세부 정책들로 나뉠 수 있는데...</p>`,
    tags: [],
    accessGroups: {
      read: [groups.AAA._id],
      edit: [groups.AAA._id],
    },
    status: "published",
    comments: [],
    created: new Date("2021-9-10"),
  };

  items.item133 = await post("/item", item133);

  let item141 = {
    title: "IP 차단",
    type: "card",
    owner: users.AAA._id,
    path: items.item13.path,
    content: `<p>IP는 OOO을 이용해 차단을 실시한다.</p><br><p>OOO를 이용해 차단을 하는 이유는...</p>`,
    tags: [],
    accessGroups: {
      read: [groups.AAA._id],
      edit: [groups.AAA._id],
    },
    status: "published",
    comments: [],
    created: new Date("2021-9-10"),
  };

  items.item141 = await post("/item", item141);

  let item142 = {
    title: "URL 차단",
    type: "card",
    owner: users.AAA._id,
    path: items.item13.path,
    content: `<p>URL은 XXX를 이용해 차단을 실시한다.</p><br><p>XXX는 OOO과 다르게...</p>`,
    tags: [],
    accessGroups: {
      read: [groups.AAA._id],
      edit: [groups.AAA._id],
    },
    status: "published",
    comments: [],
    created: new Date("2021-9-10"),
  };

  items.item142 = await post("/item", item142);

  let item143 = {
    title: "유해 계정 차단",
    type: "card",
    owner: users.AAA._id,
    path: items.item13.path,
    content: `<p>유해 계정은 xxx로 의심되거나 ooo등의 이유로 인해...</p>`,
    tags: [],
    accessGroups: {
      read: [groups.AAA._id],
      edit: [groups.AAA._id],
    },
    status: "published",
    comments: [],
    created: new Date("2021-9-10"),
  };

  items.item143 = await post("/item", item143);

  let item2 = {
    title: "주전산기 관리병",
    type: "cabinet",
    owner: users.BBB._id,
    path: "",
    content: `<p>주전산기 관리병은 다음과 같은 항목들을 관리 및 관제한다.</p><ul><li><p>재진지역 국방망</p></li><li><p>재진지역 인터넷망</p></li><li><p>서버 Hardware 및 Software</p></li><li><p>부두 네트워크</p></li></ul><p>또한 주장비실을 전체적으로 관리하며, 주로 통제구역인 주장비실에 출입하는 인원을 통제 및 관리한다.</p>`,
    tags: ["주장비실"],
    accessGroups: {
      read: [groups.AAA._id, groups.BBB._id, groups.CCC._id],
      edit: [groups.BBB._id],
    },
    status: "published",
    comments: [],
    created: new Date("2021-9-10"),
  };

  jwt = (
    await post("/login", {
      serviceNumber: "20-71009999",
      password: "20-71009999",
    })
  ).token;
  items.item2 = await post("/item", item2);

  let item21 = {
    title: "주간 당직",
    type: "document",
    owner: users.BBB._id,
    path: items.item2.path,
    content: `<blockquote><p>⛔ 주간 주 업무는 재진부대 <strong>네트워크 및 서버 관제</strong> 및 <strong>출입자 관리</strong>이다.<br>     위의 임무는 별도의 문서에서 서술한다.</p><p> ❗  서버 장비의 이상여부를 확인하기 위해 2시간 간격으로 <strong>서버실을 순찰</strong>한다.</p></blockquote><p><br class="ProseMirror-trailingBreak"></p><h3>0800i : 출근 및 인수인계</h3><blockquote><p>주간 당직은 <em>주야<s>비비</s></em> 이후 출근하는 것이므로 새로운 사항이 많다.<br>질문사항이 있으면 그때 그때 질문하며, <strong>모르는 사항이 없도록 최대한 숙지</strong>한다.</p></blockquote><h3>0845i : 분리수거</h3><blockquote><p>주장비실 내부의 쓰레기를 배출한다.</p></blockquote><p>[ CARD | 주장비실 청소 법]</p><h3>1115i : 1차 식교대</h3><blockquote><p>점심식사</p></blockquote><h3>1200i : 2차 식교대</h3><blockquote><p>점심식사</p></blockquote><h3>1400i : 백업 현황 조사</h3><blockquote><p>서버 체계들의 백업이 정상적으로 운용되고 있는지 확인한다.</p></blockquote><p>[ CARD | 백업 현황 조사 ]</p><h3>1745i : 야간자 인수인계 및 퇴근</h3><blockquote><p>야간자에게 주간당직 및 이전당직간 있었던 일들을 꼼꼼히 인수인계 한 후 퇴근한다.</p></blockquote>`,
    tags: ["주장비실", "주간"],
    accessGroups: {
      read: [groups.AAA._id, groups.BBB._id, groups.CCC._id],
      edit: [groups.BBB._id],
    },
    status: "published",
    comments: [],
    created: new Date("2021-9-10"),
  };

  items.item21 = await post("/item", item21);

  let item22 = {
    title: "야간 당직",
    type: "document",
    owner: users.BBB._id,
    path: items.item2.path,
    content: ``,
    tags: ["주장비실", "야간"],
    accessGroups: {
      read: [groups.AAA._id, groups.BBB._id, groups.CCC._id],
      edit: [groups.BBB._id],
    },
    status: "published",
    comments: [],
    created: new Date("2021-9-10"),
  };

  items.item22 = await post("/item", item22);

  let item211 = {
    title: "백업 현황 조사",
    type: "card",
    owner: users.BBB._id,
    path: items.item21.path,
    content: `<p>우리가 조사해야할 백업 현황은 총 00개로 백업은 크게 N가지로 나뉜다.</p><p>AA백업 BB백업 CC백업등... 각 백업들은 방법이... </p>`,
    tags: [],
    accessGroups: {
      read: [groups.AAA._id, groups.BBB._id, groups.CCC._id],
      edit: [groups.BBB._id],
    },
    status: "published",
    comments: [],
    created: new Date("2021-9-10"),
  };

  items.item211 = await post("/item", item211);
}

module.exports = { init };
