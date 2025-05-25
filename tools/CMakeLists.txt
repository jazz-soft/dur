cmake_minimum_required(VERSION 3.15)
project(tools)
set(CMAKE_SUPPRESS_REGENERATION true)
set(CMAKE_CXX_STANDARD 11)
set(CMAKE_CXX_STANDARD_REQUIRED True)

add_library(deck deck.cpp)
target_link_libraries(deck)
add_executable(test test.cpp)
