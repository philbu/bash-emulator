export const bashrc = `<pre># ~/.bashrc: executed by bash(1) for non-login shells.
# see /usr/share/doc/bash/examples/startup-files (in the package bash-doc)
# for examples

# If not running interactively, don't do anything
case $- in
    *i*) ;;
      *) return;;
esac

# don't put duplicate lines or lines starting with space in the history.
# See bash(1) for more options
HISTCONTROL=ignoreboth

# append to the history file, don't overwrite it
shopt -s histappend

# for setting history length see HISTSIZE and HISTFILESIZE in bash(1)
HISTSIZE=1000
HISTFILESIZE=2000

# check the window size after each command and, if necessary,
# update the values of LINES and COLUMNS.
shopt -s checkwinsize

# If set, the pattern "**" used in a pathname expansion context will
# match all files and zero or more directories and subdirectories.
#shopt -s globstar

# make less more friendly for non-text input files, see lesspipe(1)
[ -x /usr/bin/lesspipe ] && eval "$(SHELL=/bin/sh lesspipe)"

# set variable identifying the chroot you work in (used in the prompt below)
if [ -z "\${debian_chroot:-}" ] && [ -r /etc/debian_chroot ]; then
    debian_chroot=$(cat /etc/debian_chroot)
fi

# set a fancy prompt (non-color, unless we know we "want" color)
case "$TERM" in
    xterm-color|*-256color) color_prompt=yes;;
esac

# uncomment for a colored prompt, if the terminal has the capability; turned
# off by default to not distract the user: the focus in a terminal window
# should be on the output of commands, not on the prompt
#force_color_prompt=yes

if [ -n "$force_color_prompt" ]; then
    if [ -x /usr/bin/tput ] && tput setaf 1 >&/dev/null; then
        # We have color support; assume it's compliant with Ecma-48
        # (ISO/IEC-6429). (Lack of such support is extremely rare, and such
        # a case would tend to support setf rather than setaf.)
        color_prompt=yes
    else
        color_prompt=
    fi
fi

if [ "$color_prompt" = yes ]; then
    PS1='\${debian_chroot:+($debian_chroot)}\[\033[01;32m\]\\u@\h\[\033[00m\]:\[\033[01;34m\]\w\[\033[00m\]\$ '
else
    PS1='\${debian_chroot:+($debian_chroot)}\\u@\h:\w\$ '
fi
unset color_prompt force_color_prompt

# If this is an xterm set the title to user@host:dir
case "$TERM" in
xterm*|rxvt*)
    PS1="\[\e]0;\${debian_chroot:+($debian_chroot)}\\u@\h: \w\a\]$PS1"
    ;;
*)
    ;;
esac

# enable color support of ls and also add handy aliases
if [ -x /usr/bin/dircolors ]; then
    test -r ~/.dircolors && eval "$(dircolors -b ~/.dircolors)" || eval "$(dircolors -b)"
    alias ls='ls --color=auto'
    #alias dir='dir --color=auto'
    #alias vdir='vdir --color=auto'

    alias grep='grep --color=auto'
    alias fgrep='fgrep --color=auto'
    alias egrep='egrep --color=auto'
fi

# colored GCC warnings and errors
#export GCC_COLORS='error=01;31:warning=01;35:note=01;36:caret=01;32:locus=01:quote=01'

# some more ls aliases
alias ll='ls -alF'
alias la='ls -A'
alias l='ls -CF'

# Add an "alert" alias for long running commands.  Use like so:
#   sleep 10; alert
alias alert='notify-send --urgency=low -i "$([ $? = 0 ] && echo terminal || echo error)"
 "$(history|tail -n1|sed -e '\''s/^\s*[0-9]\+\s*//;s/[;&|]\s*alert$//'\'')"'

# Alias definitions.
# You may want to put all your additions into a separate file like
# ~/.bash_aliases, instead of adding them here directly.
# See /usr/share/doc/bash-doc/examples in the bash-doc package.

if [ -f ~/.bash_aliases ]; then
    . ~/.bash_aliases
fi

# enable programmable completion features (you don't need to enable
# this, if it's already enabled in /etc/bash.bashrc and /etc/profile
# sources /etc/bash.bashrc).
if ! shopt -oq posix; then
  if [ -f /usr/share/bash-completion/bash_completion ]; then
    . /usr/share/bash-completion/bash_completion
  elif [ -f /etc/bash_completion ]; then
    . /etc/bash_completion
  fi
fi</pre>`

export const whoami = `
Who am I?<br /> 
Hi, my name is Phil and I'm probably the reason why you visit <br />
and use this site. Currently, I am a master's student in computer<br />
science. I wrote this project in my free time and it helped me to<br />
understand more about terminals. Did you know that e.g. Ctrl+M<br />
and Ctrl+J are both a substitute for Enter? I did not. But now I <br />
do. Did you know, that Linux files and directories are pretty <br />
much the same? Well I've heard of it but now after an implementa-<br />
tion, I've learned more. Did you know that -d is a flag in UNIX<br />
style while --d is a flag in GNU style? And many more... <br />
<br />
<br />
If you are interested, here are some of my projects:<br />
<br />
* You are currently using this one. This is an emulated bash <br />
console written in typescript using the angular framework. For<br />
more information please refer to the README.md in your home <br />
directory or visit <a href="https://github.com/philbu/bash-emulator">https://github.com/philbu/bash-emulator</a><br />
<br />
* I've been developing an Android App which allows you to only<br />
play the audio of YouTube videos. Basically, a music app with<br />
a search, favorites, settings and a side-loader for updates. I'm<br />
currently planning to make the code base open-source but I did<br />
not find the time to clean up / anonymize my server address. If<br />
you are interested in using it: <a href="https://app.sensadir.de/">https://app.sensadir.de/</a><br />
<br />
* Labyrinth Bash game. A labyrinth game written entirely in bash.<br />
Maybe not the most efficient language for a game, but I was <br />
interested what I can do with reprinting existing output in a <br />
terminal. For more information please visit <br />
<a href="https://github.com/philbu/bashgame">https://github.com/philbu/bashgame</a><br />
<br />
* I did an interdisciplinary project at <a href="https://flint.gg">https://flint.gg</a> with a <br />
colleagueof mine where we implemented modular gamecards and an <br />
editor. We used Nuxt.js which combined Vuetify + Vue.js as <br />
frontend with Express.js as backend. <br />
<br />
* I visited following practical courses: system administration <br />
and network administration`

export const readme = `<pre># Description

This project does emulate a basic Bash shell with some commands.

# Working Commands

## File commands

* cat
* cd
* head
* ls
* mkdir
* pwd
* touch
* tail
* rm

## System commands

* !!
* clear
* date
* uname
* whoami (with description)

## Other commands

* echo
* help (not original)

# Added files

* /
* /home, /home/user, /home/user/(.bashrc|README.md|whoami.txt)
* /boot</pre>`