(() => {
  'use strict';

  // The year in a reading-order entry identifies the series; the year on a guide dates its story.
  const guides = [
    {
      id: 'first-steps', title: 'The first web-swing', date: '1962–63', count: 3, level: 'First read',
      shelf: ['First reads', 'Classic Peter'], world: 'Main Marvel universe', team: 'Stan Lee & Steve Ditko',
      cover: 'images/origins/amazing-fantasy-15.webp', coverTitle: 'Amazing Fantasy (1962) #15', issue: 16926,
      pitch: 'Meet the kid from Queens before anyone knows what to make of Spider-Man.',
      context: 'Peter has bills, an aunt to look after and a new talent that he thinks could pay for both. Reading his debut beside his first ongoing issues makes the money question as important as the spider bite.',
      steps: [
        ['Amazing Fantasy (1962) #15', 'Read the opening Spider-Man story in this anthology. Peter builds his web-shooters, tries show business and discovers the cost of letting someone else deal with trouble.'],
        ['The Amazing Spider-Man (1963) #1', 'Jameson’s newspaper gives the new hero a reputation he cannot control. Watch what happens when Peter treats joining the Fantastic Four like applying for a paid job.'],
        ['The Amazing Spider-Man (1963) #2', 'The Vulture gives Peter an opponent he has to outthink. Photography also gives Peter a way to earn money from the same paper that attacks him.']
      ], next: 'master-planner', bridge: 'Stay with Lee and Ditko to see how they tell an entire struggle through the pace of a page.'
    },
    {
      id: 'ultimate-peter', title: 'A new Peter for a new century', date: '2000–01', count: 7, level: 'First read',
      shelf: ['First reads', 'Alternate worlds'], world: 'Original Ultimate universe', team: 'Brian Michael Bendis & Mark Bagley',
      coverTitle: 'Ultimate Spider-Man (2000) #1', issue: 4372,
      pitch: 'A longer origin for readers who want high-school friendships and family life up front.',
      context: 'This Peter grows up in a separate continuity. Bendis and Bagley spend seven issues on the opening arc, giving Mary Jane, Uncle Ben and Norman Osborn time to shape Peter’s life. Pick the series that began in 2000.',
      steps: [
        ['Ultimate Spider-Man (2000) #1–2', 'Start at school and at Osborn’s lab. Notice how the experiment that changes Peter also makes Norman interested in what he can become.'],
        ['Ultimate Spider-Man (2000) #3–5', 'Follow the gap between what Peter can do and what he understands about it. The family conversations give the origin its weight.'],
        ['Ultimate Spider-Man (2000) #6–7', 'Finish the first confrontation with the Green Goblin. The end of #7 is a clean stopping point before Peter’s next chapter.']
      ], next: 'miles-morales', bridge: 'Follow the legacy of this universe’s Peter Parker into Miles Morales’s first stories.'
    },
    {
      id: 'miles-morales', title: 'Miles takes the mask', date: '2011', count: 6, level: 'First read',
      shelf: ['First reads', 'Alternate worlds'], world: 'Original Ultimate universe', team: 'Brian Michael Bendis & Sara Pichelli',
      cover: 'images/origins/ultimate-fallout-4.webp', coverTitle: 'Ultimate Fallout (2011) #4', issue: 39962,
      artCredit: { label: '2021 facsimile cover', url: 'https://prhcomics.com/wp-content/uploads/2021/07/July_Catalog_PREVIEWS2020013_FINAL.pdf#page=50' },
      pitch: 'Begin in Brooklyn with Miles, his friend Ganke and a suit that carries someone else’s history.',
      context: 'Miles makes his first appearance in an anthology after the Ultimate universe loses its Peter Parker. His own series then jumps back to explain how he got his powers. The change in time is intentional.',
      steps: [
        ['Ultimate Fallout (2011) #4', 'Read the Miles Morales segment first. New Yorkers already have opinions about somebody else wearing Spider-Man’s colors.'],
        ['Ultimate Comics Spider-Man (2011) #1–2', 'Go back to Miles’s school and family. Watch how he and Ganke react differently to the same discovery. Marvel’s catalog also lists this series as Ultimate Spider-Man (2011).'],
        ['Ultimate Comics Spider-Man (2011) #3–5', 'Continue through #5 to see Miles move from keeping a secret to choosing a public role. This run is the comic starting point for Miles in the animated films.']
      ], next: 'spider-gwen', bridge: 'Meet another hero who has to decide what the Spider-Man story means in her own world.'
    },
    {
      id: 'master-planner', title: 'If This Be My Destiny…', date: '1965–66', count: 3, level: 'First read',
      shelf: ['First reads', 'Classic Peter'], world: 'Main Marvel universe', team: 'Stan Lee & Steve Ditko',
      coverTitle: 'The Amazing Spider-Man (1963) #31', issue: 6716,
      pitch: 'Three issues, a sick Aunt May and the sequence that made lifting rubble feel monumental.',
      context: 'Peter has just started college. While a mysterious planner steals scientific equipment, Aunt May’s illness gives Peter a very personal deadline. The hero’s hardest problem comes after the fighting.',
      steps: [
        ['The Amazing Spider-Man (1963) #31', 'Begin with Peter’s first days at Empire State University. He looks aloof to his new classmates because his attention is somewhere else.'],
        ['The Amazing Spider-Man (1963) #32', 'Follow the stolen medical material to the Master Planner’s base. Keep track of what Peter came to retrieve.'],
        ['The Amazing Spider-Man (1963) #33', 'Read the opening pages slowly. Ditko changes the size of the panels as Peter tries to move, turning time and effort into something you can see.']
      ], next: 'spider-man-no-more', bridge: 'Compare Peter’s determination here with a later story in which he decides to walk away.'
    },
    {
      id: 'spider-man-no-more', title: 'Spider-Man No More!', date: '1967', count: 3, level: 'First read',
      shelf: ['First reads', 'Classic Peter'], world: 'Main Marvel universe', team: 'Stan Lee & John Romita Sr.',
      coverTitle: 'The Amazing Spider-Man (1963) #50', issue: 6869,
      pitch: 'Peter puts the costume in the trash just as a new crime boss sees an opening.',
      context: 'Spider-Man costs Peter time with his family and gives him a city full of critics. This three-issue stretch follows his attempt to take his life back and introduces Wilson Fisk, the Kingpin.',
      steps: [
        ['The Amazing Spider-Man (1963) #50', 'Start with Peter’s decision to quit. Romita’s discarded suit became a visual touchstone for the Raimi films.'],
        ['The Amazing Spider-Man (1963) #51', 'The Kingpin brings organized crime into focus. Notice how much trouble one man can cause without superpowers.'],
        ['The Amazing Spider-Man (1963) #52', 'Finish the showdown with Fisk. Read the scenes with Jameson alongside Peter’s return to the job.']
      ], next: 'gwen-stacy', bridge: 'For another story about the cost of two lives, follow Peter and Gwen into the early 1970s.'
    },
    {
      id: 'gwen-stacy', title: 'Gwen and the Green Goblin', date: '1973', count: 2, level: 'Some background',
      shelf: ['Classic Peter'], world: 'Main Marvel universe', team: 'Gerry Conway & Gil Kane',
      coverTitle: 'The Amazing Spider-Man (1963) #121', issue: 6507,
      pitch: 'A two-part turning point for Peter, Gwen Stacy and Norman Osborn.',
      context: 'Gwen is Peter’s girlfriend. Norman Osborn is his friend Harry’s father and the Green Goblin. Those two facts give a new reader enough context for a story that reaches far beyond its bridge sequence.',
      steps: [
        ['The Amazing Spider-Man (1963) #121', 'Start with Harry’s illness and Norman’s distress. Follow what each character knows as the danger shifts toward Gwen.'],
        ['The Amazing Spider-Man (1963) #122', 'Read the immediate aftermath before moving on. The final pages with Mary Jane tell a quieter part of the same story.']
      ], next: 'spider-man-blue', bridge: 'Read Peter’s memories of Gwen in a later miniseries that returns to their early days together.'
    },
    {
      id: 'black-costume', title: 'Inside the black costume', date: '1984–85', count: 3, level: 'First read',
      shelf: ['First reads', 'Classic Peter', 'Villains'], world: 'Main Marvel universe', team: 'Tom DeFalco, Roger Stern & Ron Frenz in #252',
      coverTitle: 'The Amazing Spider-Man (1963) #252', issue: 6652,
      pitch: 'Three milestones trace the alien suit from an apparent upgrade to a problem Peter cannot take off.',
      context: 'Peter returns from Battleworld wearing a new costume. This short route selects the return, the examination and the confrontation from a longer saga that crossed several series.',
      steps: [
        ['The Amazing Spider-Man (1963) #252', 'Meet the black costume in New York. Pay attention to the useful things it can do before anyone knows how it works.'],
        ['The Amazing Spider-Man (1963) #258', 'Move to Reed Richards’s examination of the suit. Peter brings a practical question to the Fantastic Four and gets a much more unsettling answer.'],
        ['Web of Spider-Man (1985) #1', 'Switch series for the bell-tower confrontation. The sound and architecture of the church become part of Peter’s solution.']
      ], next: 'venom', bridge: 'Follow the suit to its next major host and the first full confrontation with Venom.'
    },
    {
      id: 'venom', title: 'The road to Venom', date: '1988', count: 3, level: 'Some background',
      shelf: ['Villains', 'Classic Peter'], world: 'Main Marvel universe', team: 'David Michelinie & Todd McFarlane',
      coverTitle: 'The Amazing Spider-Man (1963) #298', issue: 6702,
      pitch: 'An unseen threat edges into Peter and Mary Jane’s life before Eddie Brock steps forward.',
      context: 'Peter has already rejected the living black costume. Its history with him matters because the next person to wear it inherits knowledge an ordinary enemy could never have.',
      steps: [
        ['The Amazing Spider-Man (1963) #298', 'Read the Chance story and the hints around its edges. The new threat is still in the background.'],
        ['The Amazing Spider-Man (1963) #299', 'Watch the private spaces around Peter and Mary Jane. The last pages change the scale of the threat.'],
        ['The Amazing Spider-Man (1963) #300', 'Finish with Eddie Brock’s account of his grievance and the first full Venom confrontation. Compare McFarlane’s two silhouettes when the characters share a panel.']
      ], next: 'black-costume', bridge: 'Go back to the suit’s first New York appearance to see which of Venom’s advantages came from Peter.'
    },
    {
      id: 'kraven', title: 'Kraven’s Last Hunt', date: '1987', count: 6, level: 'Some background',
      shelf: ['Villains', 'Classic Peter'], world: 'Main Marvel universe', team: 'J. M. DeMatteis & Mike Zeck',
      coverTitle: 'Web of Spider-Man (1985) #31', issue: 12027,
      pitch: 'A six-part psychological thriller told across three monthly titles. Follow the chapter order.',
      context: 'Peter and Mary Jane have recently married. Kraven wants to prove he can surpass Spider-Man, and wearing Peter’s costume becomes part of his plan. Expect a dark story about obsession and identity.',
      steps: [
        ['Web of Spider-Man (1985) #31', 'Part one. Begin inside the hunter’s state of mind as Kraven prepares his final challenge.'],
        ['The Amazing Spider-Man (1963) #293', 'Part two. Switch titles and stay with Kraven’s attempt to take Spider-Man’s place.'],
        ['Peter Parker, The Spectacular Spider-Man (1976) #131', 'Part three. The hunt for Vermin gives Kraven a test for his version of Spider-Man.'],
        ['Web of Spider-Man (1985) #32', 'Part four. Return to Web and watch what pulls Peter back toward the people he loves.'],
        ['The Amazing Spider-Man (1963) #294', 'Part five. Peter and Kraven finally face what the hunt means to each of them.'],
        ['Peter Parker, The Spectacular Spider-Man (1976) #132', 'Part six. Finish the Vermin thread and return to Mary Jane for the human cost of the hunt.']
      ], next: 'spider-man-blue', bridge: 'For a quieter look at how Peter carries grief, pick up Spider-Man: Blue.'
    },
    {
      id: 'spider-gwen', title: 'Gwen’s side of the web', date: '2014–15', count: 6, level: 'First read',
      shelf: ['First reads', 'Alternate worlds'], world: 'Earth-65', team: 'Jason Latour & Robbi Rodriguez',
      coverTitle: 'Edge of Spider-Verse (2014) #2', issue: 50955,
      pitch: 'On Gwen’s Earth, a punk drummer answers the spider bite and her father investigates Spider-Woman.',
      context: 'This Gwen is a hero in her own right. The Mary Janes, a band rehearsal and a police pursuit introduce her world faster than a tour of its alternate history.',
      steps: [
        ['Edge of Spider-Verse (2014) #2', 'Start with Gwen’s anthology spotlight. Each issue introduces a different world, so you can open this one directly.'],
        ['Spider-Gwen (February 2015 series) #1–2', 'Move to the first Spider-Gwen run. Follow the rift between Gwen’s life with the band and her responsibilities as Spider-Woman.'],
        ['Spider-Gwen (February 2015 series) #3–5', 'Continue to the end of the five-issue run. In a collected edition, look for Most Wanted? A second Spider-Gwen series also launched in 2015.']
      ], next: 'miles-morales', bridge: 'Compare Gwen’s relationship with her father to Miles’s choices about what he tells his family.'
    },
    {
      id: 'spider-man-blue', title: 'Spider-Man: Blue', date: '2002–03', count: 6, level: 'Some background',
      shelf: ['Classic Peter'], world: 'Main Marvel universe', team: 'Jeph Loeb & Tim Sale',
      coverTitle: 'Spider-Man: Blue (2002) #1', issue: 10929,
      pitch: 'Peter records a Valentine’s Day message and remembers the beginning of his relationship with Gwen.',
      context: 'The older Peter narrates while the younger Peter lives through the scenes. This self-contained series assumes you know the outcome of Gwen’s classic storyline. Start with the Gwen and Green Goblin guide if you want to experience that first.',
      steps: [
        ['Spider-Man: Blue (2002) #1–2', 'Notice the recording device that frames the story. Peter chooses what to remember and how to explain it.'],
        ['Spider-Man: Blue (2002) #3–4', 'Follow Gwen and Mary Jane through the same circle of friends. Watch the body language in Sale’s quieter panels between fights.'],
        ['Spider-Man: Blue (2002) #5–6', 'Finish the six-issue memory in order. Return to the present-day framing scene after the final confrontation.']
      ], next: 'life-story', bridge: 'Try another complete miniseries that uses the passage of time as its central idea.'
    },
    {
      id: 'life-story', title: 'One life in six decades', date: '2019', count: 6, level: 'Some background',
      shelf: ['Alternate worlds'], world: 'Standalone alternate history', team: 'Chip Zdarsky & Mark Bagley',
      coverTitle: 'Spider-Man: Life Story (2019) #1', issue: 74803,
      pitch: 'What if the teenager bitten in 1962 kept aging? Each issue advances roughly a decade.',
      context: 'Peter’s life moves through actual decades here. Familiar characters and choices acquire different consequences as he ages. The main story is complete in six issues.',
      steps: [
        ['Spider-Man: Life Story (2019) #1–2', 'Begin in the 1960s and move into the 1970s. Note which relationships carry across the break and which decisions Peter brings with him.'],
        ['Spider-Man: Life Story (2019) #3–4', 'Continue through the 1980s and 1990s. Look at what changes in Peter’s family between chapters.'],
        ['Spider-Man: Life Story (2019) #5–6', 'Read the 2000s and 2010s together. Questions about age and succession pay off across these final chapters.']
      ], next: 'first-steps', bridge: 'Return to the 1962 debut and compare how much each version lets the first decision determine Peter’s life.'
    }
  ];
  window.SpiderIndexComics = guides.map(guide => ({
    ...guide,
    cover: guide.cover || 'images/comics/' + guide.id + '.webp',
    source: 'https://www.marvel.com/comics/issue/' + guide.issue + '/'
  }));
})();
