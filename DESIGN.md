# Portfolio design

## Idea

A personal site that leads with Shintaro's own photos. The strip of photos
under the greeting is the one bold moment; everything else stays quiet and
readable so uni friends and developers can both follow it.

## Palette

Colours come from the photos. Light only, no dark mode.

| Token   | Hex       | Use                                 |
| ------- | --------- | ----------------------------------- |
| `sky`   | `#F2F5F5` | page background (overcast Auckland) |
| `paper` | `#FFFFFF` | code backgrounds, lightbox text     |
| `ink`   | `#16323B` | text (harbour slate)                |
| `stone` | `#56676C` | secondary text                      |
| `tide`  | `#1C7178` | links (sea glass)                   |
| `sun`   | `#EE8A1E` | link hover, selection, map route    |
| `line`  | `#D3DCDD` | row dividers                        |

Charts use two extra colours that pass a colour-blind separation check on
`sky`: `chart-a` `#00909E` for work and monthly activity, `chart-b` `#C26F10`
for open source.

## Type

Mona Sans only. Headings use the wide width (`font-stretch: 125%`) at heavy
weights; body text uses the normal width at 18px / 1.6.

## Layout

- Left aligned, 12-column grid, max width 75rem.
- Section heading on the left, short intro on the right.
- Work is a list of rows, not cards.
- Real visuals instead of decoration: screenshots of the sites, a map of
  where Shintaro has lived, a monthly activity chart, and a jobs timeline.
- Motion: one load sequence in the hero, the map route drawing as it scrolls
  into view, and the photo lightbox opening.

## Writing

Plain, first person, no jargon. Explain projects by what they do for people.
