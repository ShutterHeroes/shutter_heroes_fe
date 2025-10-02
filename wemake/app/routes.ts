import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  index("common/pages/home-page.tsx"),
  ...prefix("pictures", [
    index("features/pictures/pages/pictures-page.tsx"),
    ...prefix("leaderboards", [
      index("features/pictures/pages/leaderboard-page.tsx"),
      route(
        "/yearly/:year",
        "features/pictures/pages/yearly-leaderboard-page.tsx"
      ),
      route(
        "/monthly/:year/:month",
        "features/pictures/pages/monthly-leaderboard-page.tsx"
      ),
      route(
        "/daily/:year/:month/:day",
        "features/pictures/pages/daily-leaderboard-page.tsx"
      ),
      route(
        "/weekly/:year/:week",
        "features/pictures/pages/weekly-leaderboard-page.tsx"
      ),
      route(
        "/:period",
        "features/pictures/pages/leaderboards-redirection-page.tsx"
      ),
    ]),
    ...prefix("categories", [
      index("features/pictures/pages/categories-page.tsx"),
      route("/:category", "features/pictures/pages/category-page.tsx"),
    ]),
    route("/search", "features/pictures/pages/search-page.tsx"),
    route("/submit", "features/pictures/pages/submit-picture-page.tsx"),
    route("/promote", "features/pictures/pages/promote-page.tsx"),
    ...prefix("/:pictureId", [
      index("features/pictures/pages/picture-redirect-page.tsx"),
      layout("features/pictures/layouts/picture-overview-layout.tsx", [
        route("/overview", "features/pictures/pages/picture-overview-page.tsx"),
        ...prefix("/reviews", [
          index("features/pictures/pages/picture-reviews-page.tsx"),
        ]),
      ]),
    ]),
  ]),
  ...prefix("/auth", [
    layout("features/auth/layouts/auth-layout.tsx", [
      route("/login", "features/auth/pages/login-page.tsx"),
      route("/join", "features/auth/pages/join-page.tsx"),
      ...prefix("/otp", [
        route("/start", "features/auth/pages/otp-start-page.tsx"),
        route("/complete", "features/auth/pages/otp-complete-page.tsx"),
      ]),
      ...prefix("/social/:provider", [
        route("/start", "features/auth/pages/social-start-page.tsx"),
        route("/complete", "features/auth/pages/social-complete-page.tsx"),
      ]),
    ]),
  ]),
  ...prefix("/my", [
    layout("features/users/layouts/dashboard-layout.tsx", [
      ...prefix("/dashboard", [
        index("features/users/pages/dashboard-page.tsx"),
        route(
          "/pictures/:pictureId",
          "features/users/pages/dashboard-picture-page.tsx"
        ),
      ]),
    ]),
    ...prefix("/messages", [
      index("features/users/pages/messages-page.tsx"),
      route("/:messageId", "features/users/pages/message-page.tsx"),
    ]),
    route("/profile", "features/users/pages/my-profile-page.tsx"),
    route("/settings", "features/users/pages/settings-page.tsx"),
    route("/notifications", "features/users/pages/notifications-page.tsx"),
  ]),
  layout("features/users/layouts/profile-layout.tsx", [
    ...prefix("/users/:username", [
      index("features/users/pages/profile-page.tsx"),
      route("/pictures", "features/users/pages/profile-pictures-page.tsx"),
    ]),
  ]),
  ...prefix("/map", [
    route("/map", "features/map/pages/map.tsx"),
  ]),
  ...prefix("/picture-submit", [
    route("/submit-picture-page", "features/picture-submit/pages/submit-picture-page.tsx"),
  ]),
] satisfies RouteConfig;