cmake_minimum_required(VERSION 3.15)
project(tools)
set(CMAKE_SUPPRESS_REGENERATION true)
set(CMAKE_CXX_STANDARD 11)
set(CMAKE_CXX_STANDARD_REQUIRED True)

add_library(deck deck.cpp)

add_executable(test test.cpp)
target_link_libraries(test deck)

add_executable(enum enum.cpp state.cpp)
target_link_libraries(enum deck)
