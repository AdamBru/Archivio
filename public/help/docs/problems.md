# Problemy

Poniżej zostały opisane popularne problemy oraz sposoby na ich rozwiązanie.

## Aplikacja "zawiesiła się" {#app-frozen}

Gdy aplikacja będzie długo w stanie "bez odpowiedzi" należy odświeżyć aplikację przyciskiem Odśwież z [paska menu](interface.html#pasek-menu). Jeśli to nie pomoże, należy ponownie uruchomić aplikację.

## Baza danych została przypadkowo usunięta {#deleted-database}

Jeśli nastąpi przypadkowe nadpisanie pliku bazy dancyh przy imporcie lub usunięcie przy przywracaniu stanu początkowego, istnieje możliwość odzyskania danych. Przy każdej z tych czynności następuje kopia bazy danych. Aby odzyskać dane należy zamknąć aplikację i wejść do katalogu danych aplikacji:

- W systemie Windows:

  <nobr>C:\Users\\[nazwa użytkownika]</nobr>\AppData\Roaming\Archivio

  _( ++win+r++ , polecenie uruchom: %appdata%)_

Nasępnie należy odszukać plik z najnowszą datą w nazwie (np. _archivio_2026-04-01_12-10-00.old_) i zmienić jego nazwę na _archivio.db_. Jeśli system operacyjny upewni się czy na pewno zmienić rozszerzenie pliku, należy to potwierdzić.
