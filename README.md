Flowur
======

The Flowur project is a collection of tools aimed at optimizing the creation of flowcharts, diagnostics, and other graph based visualizations. Flowur has two main components: interfaces and templates. Interfaces focus on retrieving user data intuitively and quickly. Templates generate interpretations of the data set they are given.


Interfaces
===========
Interfaces streamline node based data entry and build a JSON file using the Flowur markup.



Templates
=========
Templates consist of routing algorithms, functionality code, and graphical styling. The existing code associated with the Flowur project along with the standardized markup makes the process of building a template more focused on realizing the actual concept.

Markup
======
The JSON markup consists of a title, nodes, and arrows. Nodes have an 'id', 'data', and a 'type'. Arrows have 'from' and 'to' ids that refer to associated nodes. Currently arrows are generated with an 'isLink' value that denotes a back/forward edge but the team plans to cycle out the usage of this value over the next few weeks.

License
=======
Copyright (c) 2012, Flowur
All rights reserved.


Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * Neither the "Flowur" name nor the names of its contributors may be 
      used to endorse or promote products derived from this software 
      without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER(S) BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
