import { Typography, Stack } from "@mui/material";
import { openUrl } from "@tauri-apps/plugin-opener";

export default function SettingsAbout() {
  function openInBrowser() {
    openUrl("https://github.com/AdamBru");
  }

  return (
    <Stack
      sx={{
        height: "100%",

        justifyContent: "center",
        alignItems: "center",
      }}
      spacing={2}
    >
      <img src="Square150x150Logo.png" alt="App logo" width="100px" />
      <Stack sx={{ alignItems: "center" }}>
        <Typography variant="h5" sx={{ fontWeight: "light" }}>
          Archivio
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: "light" }}>
          wersja 1.0.0
        </Typography>
      </Stack>

      <Stack sx={{ alignItems: "center" }} spacing={1}>
        <Typography variant="body1" sx={{ fontWeight: "light", pt: 2 }}>
          AdamBru &copy; 2026
        </Typography>
        {/* prettier-ignore */}
        <img
          src="/GitHub_Invertocat_Black.svg"
          alt="GitHub Logo Link"
          width="35"
          onClick={openInBrowser}
	  	  style={{cursor: "pointer"}}
		  title="Otwórz profil autora w serwisie GitHub"
        />
      </Stack>
    </Stack>
  );
}
