import {
  type RouteConfig,
  index,
  route,
  prefix,
} from "@react-router/dev/routes";

export default [
  // 홈
  index("common/pages/home-page.tsx"),

  // 인증
  ...prefix("/auth", [
    route("/login", "features/auth/pages/login-page.tsx"),
    route("/join", "features/auth/pages/join-page.tsx"),
  ]),

  // TODO: 이후 단계에서 추가할 라우트들
  // ...prefix("/sightings", [
  //   index("features/sightings/pages/sightings-page.tsx"),
  //   route("/submit", "features/sightings/pages/submit-sighting-page.tsx"),
  //   route("/map", "features/sightings/pages/map-page.tsx"),
  //   route("/:sightingId", "features/sightings/pages/sighting-detail-page.tsx"),
  // ]),

  // ...prefix("/users", [
  //   index("features/users/pages/users-page.tsx"),
  //   route("/:userId", "features/users/pages/user-profile-page.tsx"),
  // ]),

  // ...prefix("/my", [
  //   route("/profile", "features/users/pages/my-profile-page.tsx"),
  //   route("/sightings", "features/users/pages/my-sightings-page.tsx"),
  //   route("/settings", "features/users/pages/settings-page.tsx"),
  // ]),
] satisfies RouteConfig;
