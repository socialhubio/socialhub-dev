---
id: ticket-api
title: Ticket API
---

#### Diese Übersetzung ist veraltet. Die vollständige Dokumentation findet man [hier auf English](api.md).

Die SocialHub-Ticket-API ist die erste RESTlike HTTP-Schnittstelle unserer Public API welche sich aktuell unter der URL `https://api.socialhub.io/inbox/tickets` befindet. Da aktuell nur das Erstellen von Tickets unterstützt wird funktioniert diese nur mit der HTTP-POST-Methode.

Der Access-Token des Custom Channels muss über den URL-Query-Parameter "accesstoken" mitgeliefert werden. Der erwartete HTTP-Request und Response-Content-Type ist stets application/json.

## Beispiel

Ein Beispiel-Request mit dem Unix-Tool curl:

```bash
curl -X POST "https://api.socialhub.io/inbox/tickets?accesstoken=eyJhbGciO*" -d '
{
 "interaction": {
   "message": "Hallo, kann mir jemand helfen?",
   "createdTime": "2019-01-28T16:58:12.736Z",
   "networkItemId": "question-q_0000000001",
   "url": "http://example.com/questions/q_0000000001"
 }
}
' -H "Content-Type: application/json"
```

\* Der Access-Token wurde gekürzt.

## Spezifikation

Ein Ticket ist eine Entität innerhalb des SocialHubs die verwaltet werden kann (Zuweisen, Erledigen, Notiz anhängen, etc.). Ein Ticket enthält Informationen über eine Interaktion welche außerhalb des SocialHubs geschehen ist (z.B. ein Facebook-Kommentar).

Mit der Ticket-API kann man also ein Ticket im SocialHub erstellen welches stellvertretend für die Interaktion steht die außerhalb des SocialHubs passiert ist.

### Ticket Struktur

Eine Erklärung zu den erlaubten Feldern des HTTP-Requests zum erstellen eines Tickets:

| Feld            | Beschreibung                                              |
|-----------------|-----------------------------------------------------------|
| `interaction`   | Enthält Informationen zu der Interaktion als Unter-Objekt |

### `interaction`

| Feld            | Beschreibung                                              |
|-----------------|-----------------------------------------------------------|
| `message`       | Die Nachricht der Interaktion. Im Beispiel eines Facebook-Kommentars wäre dieses Feld mit dem Text des Kommentars zu befüllen. Der Text einer Nachricht darf bis zu 10.000 Zeichen lang sein. Optional falls es pictures oder attachments gibt. |
| `pictures`      | Liste von Bildern der Interaktion. Optional falls es eine message oder attachments gibt. |
| `attachments`   | Liste von Dateianhängen der Interaktion. Optional falls es eine message oder pictures gibt. |
| `createdTime`   | Optional: Der Erstellungszeitpunkt der Interaktion (ISO 8601). Im Beispiel eines Facebook-Kommentars wäre dieses Feld der Zeitpunkt zu dem der Kommentar auf Facebook erstellt wurde. Wenn dieses Feld fehlt wird die aktuelle Uhrzeit und das aktuelle Datum verwendet. |
| `networkItemId` | Ist ein eindeutiges Identifizierungsmerkmal der Interaktion. Dieses Feld muss für jedes Ticket (innerhalb eines Kanals) einzigartig sein, ansonsten wird ein *HTTP-409-Conflict*-Fehler zurück gegeben. Regex Muster: `^[a-zA-Z0-9\/|@&$!?\()[\]{}+*~,;.:=_-]{6,256}$` |
| `url`           | Optional: Ein Link zur Interaktion. Im Beispiel eines Facebook-Kommentars wäre dieses Feld ein direkter Link zum Kommentar auf facebook.com. |

### `interaction.pictures`

| Feld            | Beschreibung                                              |
|-----------------|-----------------------------------------------------------|
| `small`   | URL einer Vorschau-Version des Bildes. URL muss das HTTPS Protokoll nutzen. |
| `large`   | Optional: URL einer Voll-Version des Bildes. URL muss das HTTPS Protokoll nutzen. |

### `interaction.attachments`

| Feld            | Beschreibung                                              |
|-----------------|-----------------------------------------------------------|
| `url`           | URL um den Dateianhang herunter zu laden. URL muss das HTTPS Protokoll nutzen. |
| `name`          | Optional: Dateiname des Anhangs. |
| `size`          | Optional: Numerische Größe der Datei in Bytes. |
| `mimeType`      | Optional: Typ des Dateianhangs im mime-type format (Beispiel: "application/pdf") |

## Responses

Die folgenden Antworten der SocialHub-Ticket-API sollten von einem Client verarbeitet werden können:

### HTTP 200 OK
```json
{
 "_id": "5c4f352c659f720bc362e7b2",
 "channelId": "5c47356044b1d311b693f88a",
 "accountId": "5c07ba385415b81194b24751",
 "createdTime": "2019-01-28T17:00:28.707Z",
 "interaction": {
   "socialNetwork": "CUSTOM",
   "createdTime": "2019-01-28T16:58:12.736Z",
   "type": "TICKET",
   "message": "Hallo, kann mir jemand helfen?",
   "networkItemId": "question-q_0000000001",
   "url": "http://example.com/questions/q_0000000001"
 }
}
```

Der `_id` Wert ist ein einzigartiges Identifizierungsmerkmal eines Tickets im SocialHub. Dieser sollte für eventuelle zukünftige Aktionen als Referenz zur Interaktion abgespeichert werden.

### HTTP 409 Conflict

```json
{
 "code": "ConflictError",
 "message": "Error: Ticket with such network item id already exists"
}
```

Fehler: Das `networkItemId` Feld enthielt einen Wert der bereits in einem anderen Ticket innerhalb des selben Kanals verwendet wurde. Wurde bereits ein Ticket für diese Interaktion erstellt?

### HTTP 401 Unauthorized

```json
{
 "code": "AccessTokenInvalidError",
 "message": "Error: Invalid access token"
}
```

Fehler: Das als Query-Parameter angegebene `accesstoken` ist nicht (mehr) gültig. Bitte Kontakt mit dem Administrator des SocialHub-Accounts aufnehmen und weitere Requests aussetzen.

### HTTP 403 Forbidden

```json
{
 "code": "ChannelDeactivated",
 "message": "Error: Channel is deactivated"
}
```

Fehler: Der Custom Channel wurde von dem Administrator des SocialHub-Accounts gelöscht. Bitte Kontakt mit diesem aufnehmen und weitere Requests aussetzen.

### HTTP 429 Too Many Requests

```json
{
 "code": "TooManyRequestsError",
 "message": "Error: Too many requests."
}
```

Fehler: Es wurden zu viele Anfragen innerhalb kurzer Zeit an die SocialHub-Ticket-API gesendet. Bitte sofort weitere Requests aussetzen und die im `Retry-After`-HTTP-Header angegebene anzahl von Millisekunden warten.

```yaml
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: -1
Retry-After: 880057
```

Du hast Feedback / Vorschläge hierzu oder es gibt Probleme mit den hier beschriebenen Informationen?

Schreib uns eine E-Mail an support@socialhub.io und wir werden versuchen, so schnell wie möglich zu helfen.
