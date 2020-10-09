# DealerOnCodingTest

## Overview
This is a front-end that I created as a test project for a job opening at DealerOn, a company whose mission is to make car buying in the digital age better than ever. The job opening was for a Junior Front End Software Engineer.

It was a pretty simple problem - essentially, just map a robot's movements along a two-dimensional grid, and output the results - if my goal was to simply complete the task and show them that I've got some basic computer science skills, I would have just spent an hour or two on it and called it a day.

But what I really wanted to show them is that I'd make a great Front End Software Engineer! So I got a little creative with the prompt, and made a whole 'NASA Mission Control' themed React interface that would show off my deeper development skills, as well as my ability to achieve some tricky design with CSS.

The resulting interface took the better part of two days, plus a morning checking for bugs, and it consists of two main parts: a CSS grid display that dynamically resizes based on input parameters, as well as a terminal to input instructions for the rovers, styled the old-fashioned way.

## Try it out!

If you're reading this, you already found the Github repo! Just download it to your computer, make sure [Node.js](https://nodejs.org/en/) is installed to have access to npm, navigate your directory to the `dealeron` folder, and run `npm install`, and then when that's done, `npm start`. It should then open in your browser window. 

## What were the hard parts?
This application was built off of `create-react-app`, and I recently completed a React course through Udacity to shore up any gaps in my React skills, so the React was a breeze. The tricky parts involved dynamic CSS for the Rover grid, and completely overhauling an external component, Xterm.js, to work like an actual terminal instead of just looking like one.

### The Rover Grid
This part was designed around CSS Grids, the super-powerful CSS framework that puts things in, well, a grid. The hard part revolved around a constraint of the problem: it had to work for any size grid. While it sounds simple enough to dynamically resize it, it's not - without some really careful work, it either completely stretches outside of its container, or for non-square grids, looks totally stretched out and warped.

### The terminal
The terminal is built on top of a third-party component called XTerm - a 'terminal emulator' that really only achieves the terminal look. Out of the box, it provides three main functions: the ability to write to the terminal, the ability to move the text cursor around, and the ability to wipe the whole terminal. It doesn't even support backspace - I had to write the code that achieves that.

This part wasn't necessarily hard - but it was a lot of work. I had to basically hand-code the complete functionality of a terminal, squishing a lot of bugs in the process, and make the whole thing feel totally natural - like you were actually telling a Mars rover what to do through a command terminal. After a lot of logic, validation, and testing, I'm really happy with how it turned out.

## What I would do if I had more time
Since this was just a basic test project for potential hires, it didn't make sense to track down every single edge case and polish every single piece - after some hard work, you hit diminishing returns, and it would have been a week until the employer heard back from me. So there's a couple things I couldn't polish that I wish I could have:

- 'Reactify' more things. There are a couple of small UI elements that probably could have been made their own components but were not. Also, right now components contain both form and function - it's a better practice to separate the logic into control components. 

- Add Redux. There's a lot of communication between sibling components in this application - with vanilla React, the parent component has to act as an intermediary. That's a very good use case for Redux, and adding it would have made the code that much cleaner. 

- Responsiveness. I actually spent a few hours on this, making the Rover Map dynamically shrink as the page size changed, but I couldn't easily control the third-party styling of the terminal, which created a lot of issues as the page or grid size changed, so I cut my losses and moved on.

- Move everything over to Typescript. This was DealerOn's preference, but unfortunately I ran into a lot of weird configuration issues as soon as I started trying to use Typescript instead of Javascript. Fixing it would have required some changes to the Webpack config, which apparently create-react-app does not let me do. It looked like a big rabbit hole to solve a relatively small problem, given that Typescript is a superset of Javascript, and one that wouldn't have proven all that much about me as a developer.

- Spend some more time styling the 'Overview' and 'Code Formatting' sections. They look a little too juvenile, but I coldn't easily think up what a better look would be. Restyling them too much tended to cause graphical bugs with the terminal, and ultimately this would have spoken more about my skills as a UX designer than as a Frontend Developer, and DealerOn cares much more about the latter.

- Use some sort of code commenting convention to style my code. I took a lot of effort to make sure it's naturally readable, as well as explain parts that might be confusing, but the comments would look cleaner and be a bit more readable if they followed a specific convention. 

## Conclusion

Anyways, I hope you enjoy! I am currently looking for a new role, so if you happen to be looking for a new full stack or front end developer, please feel free to take a look at [my resume](https://drive.google.com/file/d/1XFpPpb32Fr-AMSAoQmpiab4JVMQRSVOZ/view?usp=sharing) or email me at christianmay21 at gmail dot com about any opportunities. 